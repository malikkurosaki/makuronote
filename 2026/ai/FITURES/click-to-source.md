# Click-to-Source (Dev Inspector)

Fitur yang memungkinkan developer mengklik elemen di browser dan langsung membuka file sumber di editor. Hanya aktif di mode development.

**Shortcut**: `Ctrl+Shift+Cmd+C` (macOS) / `Ctrl+Shift+Alt+C` (Windows/Linux)

---

## Cara Kerja

1. **Vite Plugin** (`src/inspector-plugin.ts` — nama bebas) meng-inject `data-inspector-*` attributes ke setiap JSX element saat build time
2. **DevInspector** component (`src/DevInspector.tsx` — nama bebas) menangkap klik di browser, membaca attributes tersebut
3. Browser mengirim `POST /__open-in-editor` ke server
4. Server membuka file di editor via `Bun.spawn`

---

## File

### 1. `src/inspector-plugin.ts` — Vite plugin `inspectorPlugin()`

Plugin dengan `enforce: 'pre'` agar jalan sebelum React/OXC transform mengubah source. Membaca file asli dari disk untuk line number akurat — code yang diterima plugin bisa sudah di-transform oleh plugin lain.

```ts
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

export function inspectorPlugin(): Plugin {
  const rootDir = process.cwd();
  return {
    name: "inspector-inject",
    enforce: "pre",
    transform(code, id) {
      if (!/\.[jt]sx(\?|$)/.test(id) || id.includes("node_modules"))
        return null;
      if (!code.includes("<")) return null;

      const cleanId = id.replace(/\?.*$/, "");
      const relativePath = path.relative(rootDir, cleanId).replace(/\\/g, "/");

      let originalLines: string[] | null = null;
      try {
        originalLines = fs.readFileSync(cleanId, "utf-8").split("\n");
      } catch {}

      let modified = false;
      let lastOrigIdx = 0;
      const lines = code.split("\n");
      const result: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const jsxPattern =
          /(<(?:[A-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*|[a-z][a-zA-Z0-9-]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*))\b/g;
        let match: RegExpExecArray | null = jsxPattern.exec(line);

        while (match !== null) {
          const charBefore = match.index > 0 ? line[match.index - 1] : "";
          if (/[a-zA-Z0-9_$.]/.test(charBefore)) {
            match = jsxPattern.exec(line);
            continue;
          }

          let actualLine = i + 1;
          if (originalLines) {
            // Cross-reference dengan file asli (4 strategi pencarian)
            const afterTag = line.slice(match.index);
            const snippet = afterTag.split(">")[0]
              .replace(/\s*data-inspector-[^"]*"[^"]*"/g, "").trim();
            const tagName = match[1];
            let found = false;

            for (let j = lastOrigIdx; j < originalLines.length; j++) {
              if (originalLines[j].includes(snippet)) {
                actualLine = j + 1; lastOrigIdx = j + 1; found = true; break;
              }
            }
            if (!found) {
              for (let j = lastOrigIdx; j < originalLines.length; j++) {
                if (originalLines[j].includes(tagName)) {
                  actualLine = j + 1; lastOrigIdx = j + 1; found = true; break;
                }
              }
            }
            if (!found) {
              for (let j = 0; j < originalLines.length; j++) {
                if (originalLines[j].includes(snippet)) {
                  actualLine = j + 1; lastOrigIdx = j + 1; found = true; break;
                }
              }
            }
            if (!found) {
              for (let j = 0; j < originalLines.length; j++) {
                if (originalLines[j].includes(tagName) && !originalLines[j].trim().startsWith("</")) {
                  actualLine = j + 1; lastOrigIdx = j + 1; break;
                }
              }
            }
          }

          const col = match.index + 1;
          const attr = ` data-inspector-line="${actualLine}" data-inspector-column="${col}" data-inspector-relative-path="${relativePath}"`;
          const insertPos = match.index + match[0].length;
          line = line.slice(0, insertPos) + attr + line.slice(insertPos);
          modified = true;
          jsxPattern.lastIndex += attr.length;
          match = jsxPattern.exec(line);
        }
        result.push(line);
      }

      if (!modified) return null;
      return result.join("\n");
    },
  };
}
```

Terdaftar di `vite.config.ts` sebelum `react()`:

```ts
import { inspectorPlugin } from "./src/inspector-plugin";

export default defineConfig({
  plugins: [
    inspectorPlugin(), // harus sebelum react()
    react(),
  ],
});
```

### 2. `src/DevInspector.tsx` — Client-side inspector component

Wrapper component yang menangkap mouseover (overlay + tooltip) dan klik (buka editor) saat inspector aktif. Di-inject hanya di dev mode via dynamic import.

```tsx
import { useCallback, useEffect, useRef, useState } from "react";

interface CodeInfo {
  relativePath: string;
  line: string;
  column: string;
}

function findCodeInfo(target: HTMLElement): { element: HTMLElement; info: CodeInfo } | null {
  let el: HTMLElement | null = target;
  while (el) {
    const relativePath = el.getAttribute("data-inspector-relative-path");
    const line = el.getAttribute("data-inspector-line");
    const column = el.getAttribute("data-inspector-column");
    if (relativePath && line) {
      return { element: el, info: { relativePath, line, column: column ?? "1" } };
    }
    el = el.parentElement;
  }
  return null;
}

function openInEditor(info: CodeInfo) {
  fetch("/__open-in-editor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ relativePath: info.relativePath, lineNumber: info.line, columnNumber: info.column }),
  }).catch(() => {});
}

export function DevInspector({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastInfoRef = useRef<CodeInfo | null>(null);

  const updateOverlay = useCallback((target: HTMLElement | null) => {
    const ov = overlayRef.current;
    const tt = tooltipRef.current;
    if (!ov || !tt) return;
    if (!target) { ov.style.display = "none"; tt.style.display = "none"; lastInfoRef.current = null; return; }
    const result = findCodeInfo(target);
    if (!result) { ov.style.display = "none"; tt.style.display = "none"; lastInfoRef.current = null; return; }
    lastInfoRef.current = result.info;
    const rect = result.element.getBoundingClientRect();
    ov.style.display = "block";
    ov.style.top = `${rect.top + window.scrollY}px`;
    ov.style.left = `${rect.left + window.scrollX}px`;
    ov.style.width = `${rect.width}px`;
    ov.style.height = `${rect.height}px`;
    tt.style.display = "block";
    tt.textContent = `${result.info.relativePath}:${result.info.line}`;
    const ttTop = rect.top + window.scrollY - 24;
    tt.style.top = `${ttTop > 0 ? ttTop : rect.bottom + window.scrollY + 4}px`;
    tt.style.left = `${rect.left + window.scrollX}px`;
  }, []);

  // Mouse events + Escape saat active
  useEffect(() => {
    if (!active) return;
    const onMouseOver = (e: MouseEvent) => updateOverlay(e.target as HTMLElement);
    const onClick = (e: MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      const result = findCodeInfo(e.target as HTMLElement);
      const info = result?.info ?? lastInfoRef.current;
      if (info) {
        navigator.clipboard.writeText(`${info.relativePath}:${info.line}:${info.column}`).catch(() => {});
        openInEditor(info);
      }
      setActive(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(false); };
    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.cursor = "crosshair";
    return () => {
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.cursor = "";
      if (overlayRef.current) overlayRef.current.style.display = "none";
      if (tooltipRef.current) tooltipRef.current.style.display = "none";
    };
  }, [active, updateOverlay]);

  // Hotkey toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c" && e.ctrlKey && e.shiftKey && (e.metaKey || e.altKey)) {
        e.preventDefault(); setActive((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {children}
      <div ref={overlayRef} style={{ display:"none", position:"absolute", pointerEvents:"none",
        border:"2px solid #3b82f6", backgroundColor:"rgba(59,130,246,0.1)", zIndex:99999, transition:"all 0.05s ease" }} />
      <div ref={tooltipRef} style={{ display:"none", position:"absolute", pointerEvents:"none",
        backgroundColor:"#1e293b", color:"#e2e8f0", fontSize:"12px", fontFamily:"monospace",
        padding:"2px 6px", borderRadius:"3px", zIndex:100000, whiteSpace:"nowrap" }} />
    </>
  );
}
```

### 3. Entry point React — Wrap app dengan DevInspector (dev only)

Import conditional via dynamic import — tree-shaken di production build. Taruh di file entry React (mis. `src/main.tsx` atau `src/frontend.tsx`):

```tsx
const Inspector = import.meta.env.DEV
  ? (await import("./DevInspector")).DevInspector
  : ({ children }: { children: ReactNode }) => <>{children}</>;
```

Digunakan sebagai wrapper di sekitar komponen root `<App />`.

### 4. Backend — Endpoint `POST /__open-in-editor`

Tambahkan route ini ke server, hanya aktif saat bukan production:

```ts
"/__open-in-editor": async req => {
  if (isProduction) return new Response("Not found", { status: 404 });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const { relativePath, lineNumber, columnNumber } = await req.json() as Record<string, string>;
  const editor = process.env.REACT_EDITOR || "code";
  const loc = `${process.cwd()}/${relativePath}:${lineNumber}:${columnNumber}`;
  const noGoto = ["subl", "zed"];
  const args = noGoto.includes(editor) ? [loc] : ["--goto", loc];
  if (Bun.which(editor)) Bun.spawn([editor, ...args], { stdio: ["ignore", "ignore", "ignore"] });
  return new Response("ok");
},
```

---

## Environment Variable

```env
# .env
REACT_EDITOR=cursor   # atau: code, zed, subl
```

| Value | Binary | Format |
|-------|--------|--------|
| `cursor` | `cursor` | `--goto file:line:col` |
| `code` | `code` | `--goto file:line:col` |
| `zed` | `zed` | `file:line:col` (no --goto) |
| `subl` | `subl` | `file:line:col` (no --goto) |

---

## Dependency

Tidak ada dependency tambahan — semua menggunakan API yang sudah ada:

- **Bun**: `Bun.which()`, `Bun.spawn()`
- **Vite**: `Plugin` type dari `vite`
- **React**: `useCallback`, `useEffect`, `useRef`, `useState`
- `node:fs`, `node:path` — Node/Bun built-in

---

## Catatan Teknis

### Kenapa baca file dari disk di plugin?

Plugin Vite menerima code yang mungkin sudah di-transform oleh plugin lain (OXC, TanStack Router). Line numbers di transformed code tidak akurat. Plugin membaca file **asli dari disk** (`fs.readFileSync`) dan melakukan cross-reference 4 strategi pencarian untuk mendapatkan line number yang benar.

### `enforce: 'pre'`

Wajib agar plugin jalan **sebelum** React/OXC transform mengubah JSX. Tanpa ini, attributes tidak ter-inject dengan benar.

### Windows path normalization

`path.relative()` mengembalikan backslash di Windows. `replace(/\\/g, "/")` memastikan path selalu forward-slash untuk konsistensi di browser.

---

## Verifikasi

### 1. Vite Plugin — Build Time

Buka DevTools → Elements, inspect JSX element. Harus ada 3 attributes:

```html
<div data-inspector-line="42" data-inspector-column="5" data-inspector-relative-path="src/components/Foo.tsx">
```

### 2. Hotkey — Toggle Mode

Tekan `Ctrl+Shift+Cmd+C` (macOS) / `Ctrl+Shift+Alt+C` (Windows/Linux):
- Cursor berubah jadi **crosshair** → inspector aktif
- Tekan lagi atau `Escape` → cursor normal

### 3. Hover — Overlay & Tooltip

Saat inspector aktif, arahkan mouse ke elemen:
- Kotak **biru transparan** mengelilingi elemen
- Tooltip gelap menampilkan `path:line` (relatif dari root project)

### 4. Klik — Buka Editor

Klik elemen saat inspector aktif:
- Inspector nonaktif, cursor normal
- Editor membuka file di baris yang tepat
- Path tersalin ke clipboard: `src/components/Foo.tsx:42:5`
- Network: `POST /__open-in-editor` → 200

### 5. Akurasi Line Number

Line number harus tepat (bukan hasil transform). Jika meleset >5 baris, pastikan plugin membaca `cleanId` (tanpa query string) dari disk.

### 6. Production — Tidak Aktif

- Shortcut tidak bereaksi
- Tidak ada `data-inspector-*` attributes di HTML
- Tidak ada request ke `/__open-in-editor`
- `DevInspector.tsx` ter-tree-shake dari bundle

### 7. Klik Normal Tidak Terganggu

Saat inspector nonaktif (default): semua event klik berjalan normal.

### Ringkasan Cepat

| Tes | Yang Diharapkan |
|---|---|
| Inspect element | Ada `data-inspector-*` pada JSX elements |
| Tekan shortcut | Cursor jadi crosshair |
| Hover element | Kotak biru + tooltip `path:line` |
| Klik element | Editor buka di baris tepat, request 200 |
| Build production | Tidak ada attributes, shortcut tidak aktif |
| Klik normal | Event tidak terblokir |

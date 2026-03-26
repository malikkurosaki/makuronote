# Skill: Dev Inspector — Click-to-Source untuk Bun + Elysia + Vite + React

## Ringkasan

Fitur development: klik elemen UI di browser → langsung buka source code di editor (VS Code, Cursor, dll) pada baris dan kolom yang tepat. Zero overhead di production.

**Hotkey**: `Ctrl+Shift+Cmd+C` (macOS) / `Ctrl+Shift+Alt+C` → aktifkan mode inspect → klik elemen → file terbuka.

## Kenapa Tidak Pakai Library

`react-dev-inspector` crash di React 19 karena:
- `fiber.return.child.sibling` bisa null di React 19
- `_debugSource` dihapus dari React 19
- Walking fiber tree tidak stabil antar versi React

Solusi ini **regex-based + multi-fallback**, tidak bergantung pada React internals.

## Syarat Arsitektur

Fitur ini bekerja karena 4 syarat struktural terpenuhi. Jika salah satu tidak ada, fitur tidak bisa diimplementasi atau perlu adaptasi signifikan.

### 1. Vite sebagai Bundler (Wajib)

Seluruh mekanisme bergantung pada **Vite plugin transform pipeline**:
- `inspectorPlugin()` inject attributes ke JSX saat build/HMR
- `enforce: 'pre'` memastikan plugin jalan sebelum OXC/Babel transform JSX
- `import.meta.env?.DEV` sebagai compile-time constant untuk tree-shaking

**Tidak bisa diganti dengan**: esbuild standalone, webpack (perlu loader berbeda), SWC standalone.
**Bisa diganti dengan**: framework yang pakai Vite di dalamnya (Remix Vite, TanStack Start, Astro).

### 2. Server dan Frontend dalam Satu Proses (Wajib)

Endpoint `/__open-in-editor` harus **satu proses dengan dev server** yang melayani frontend:
- Browser POST ke origin yang sama (no CORS)
- Server punya akses ke filesystem lokal untuk `Bun.spawn(editor)`
- Endpoint harus bisa ditangani **sebelum routing & middleware** (auth, tenant, dll)

**Pola yang memenuhi syarat:**
- Elysia + Vite middlewareMode (project ini) — `onRequest` intercept sebelum route matching
- Express/Fastify + Vite middlewareMode — middleware biasa sebelum auth
- Vite dev server standalone (`vite dev`) — pakai `configureServer` hook

**Tidak memenuhi syarat:**
- Frontend dan backend di proses/port terpisah (misal: CRA + separate API server) — perlu proxy atau CORS config tambahan
- Serverless/edge deployment — tidak bisa `spawn` editor

### 3. React sebagai UI Framework (Wajib untuk Multi-Fallback)

Strategi extraction source info bergantung pada React internals:
1. `__reactProps$*` — React menyimpan props di DOM element
2. `__reactFiber$*` — React fiber tree untuk walk-up
3. DOM attribute — fallback universal

**Jika pakai framework lain** (Vue, Svelte, Solid):
- Hanya strategi 3 (DOM attribute) yang berfungsi — tetap cukup
- Hapus strategi 1 & 2 dari `getCodeInfoFromElement()`
- Inject attributes tetap via Vite plugin (framework-agnostic)

### 4. Bun sebagai Runtime (Direkomendasikan, Bukan Wajib)

Bun memberikan API yang lebih clean:
- `Bun.spawn()` — fire-and-forget tanpa import
- `Bun.which()` — cek executable ada di PATH (mencegah uncatchable error)

**Jika pakai Node.js:**
- `Bun.spawn()` → `child_process.spawn(editor, args, { detached: true, stdio: 'ignore' }).unref()`
- `Bun.which()` → `const which = require('which'); which.sync(editor, { nothrow: true })`

### Ringkasan Syarat

| Syarat                        | Wajib?   | Alternatif                                           |
|-------------------------------|----------|------------------------------------------------------|
| Vite sebagai bundler          | Ya       | Framework berbasis Vite (Remix, Astro, dll)          |
| Server + frontend satu proses | Ya       | Bisa diakali dengan proxy, tapi tambah kompleksitas  |
| React                         | Sebagian | Framework lain bisa, hanya fallback ke DOM attribute |
| Bun runtime                   | Tidak    | Node.js dengan `child_process` + `which` package     |

## Arsitektur

```
BUILD TIME (Vite Plugin):
  .tsx/.jsx file
    → [inspectorPlugin enforce:'pre'] inject data-inspector-* attributes ke JSX
    → [react() OXC] transform JSX ke createElement
    → Browser menerima elemen dengan attributes

RUNTIME (Browser):
  Hotkey → aktifkan mode → hover elemen → baca attributes → klik
    → POST /__open-in-editor {relativePath, line, column}

BACKEND (Elysia onRequest):
  /__open-in-editor → Bun.spawn([editor, '--goto', 'file:line:col'])
    → Editor terbuka di lokasi tepat
```

## Komponen yang Dibutuhkan

### 1. Vite Plugin — `inspectorPlugin()` (enforce: 'pre')

Inject `data-inspector-*` ke setiap JSX opening tag via regex.

**HARUS `enforce: 'pre'`** — kalau tidak, OXC transform JSX duluan dan regex tidak bisa menemukan `<Component`.

```typescript
// Taruh di file vite config (misal: src/vite.ts atau vite.config.ts)
import path from 'node:path'
import type { Plugin } from 'vite'

function inspectorPlugin(): Plugin {
  const rootDir = process.cwd()

  return {
    name: 'inspector-inject',
    enforce: 'pre',
    transform(code, id) {
      // Hanya .tsx/.jsx, skip node_modules
      if (!/\.[jt]sx(\?|$)/.test(id) || id.includes('node_modules')) return null
      if (!code.includes('<')) return null

      const relativePath = path.relative(rootDir, id)
      let modified = false
      const lines = code.split('\n')
      const result: string[] = []

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        // Match JSX opening tags: <Component atau <div
        // Skip TypeScript generics (Record<string>) via charBefore check
        const jsxPattern = /(<(?:[A-Z][a-zA-Z0-9.]*|[a-z][a-zA-Z0-9-]*))\b/g
        let match: RegExpExecArray | null = null

        while ((match = jsxPattern.exec(line)) !== null) {
          // Skip jika karakter sebelum `<` adalah identifier char (TypeScript generic)
          const charBefore = match.index > 0 ? line[match.index - 1] : ''
          if (/[a-zA-Z0-9_$.]/.test(charBefore)) continue

          const col = match.index + 1
          const attr = ` data-inspector-line="${i + 1}" data-inspector-column="${col}" data-inspector-relative-path="${relativePath}"`
          const insertPos = match.index + match[0].length
          line = line.slice(0, insertPos) + attr + line.slice(insertPos)
          modified = true
          jsxPattern.lastIndex += attr.length
        }

        result.push(line)
      }

      if (!modified) return null
      return result.join('\n')
    },
  }
}
```

**Mengapa regex, bukan Babel?**
- `@vitejs/plugin-react` v6+ pakai OXC (Rust), bukan Babel
- Config `babel: { plugins: [...] }` di plugin-react **DIABAIKAN**
- Regex jalan sebelum OXC via `enforce: 'pre'`

**Gotcha: TypeScript generics**
- `Record<string>` → karakter sebelum `<` adalah `d` (identifier) → SKIP
- `<Button` → karakter sebelum `<` adalah space/newline → MATCH

### 2. Vite Plugin Order (KRITIS)

```typescript
plugins: [
  // 1. Route generation (jika pakai TanStack Router)
  TanStackRouterVite({ ... }),

  // 2. Inspector inject — HARUS sebelum react()
  inspectorPlugin(),

  // 3. React OXC transform
  react(),

  // 4. (Opsional) Dedupe React Refresh untuk middlewareMode
  dedupeRefreshPlugin(),
]
```

**Jika urutan salah (inspectorPlugin setelah react):**
- OXC transform `<Button>` → `React.createElement(Button, ...)`
- Regex tidak menemukan `<Button` → attributes TIDAK ter-inject
- Fitur tidak berfungsi, tanpa error

### 3. DevInspector Component (Browser Runtime)

Komponen React yang handle hotkey, overlay, dan klik.

```tsx
// src/frontend/DevInspector.tsx
import { useCallback, useEffect, useRef, useState } from 'react'

interface CodeInfo {
  relativePath: string
  line: string
  column: string
}

/** Baca data-inspector-* dari fiber props atau DOM attributes */
function getCodeInfoFromElement(element: HTMLElement): CodeInfo | null {
  // Strategi 1: React internal props __reactProps$ (paling akurat)
  for (const key of Object.keys(element)) {
    if (key.startsWith('__reactProps$')) {
      const props = (element as any)[key]
      if (props?.['data-inspector-relative-path']) {
        return {
          relativePath: props['data-inspector-relative-path'],
          line: props['data-inspector-line'] || '1',
          column: props['data-inspector-column'] || '1',
        }
      }
    }
    // Strategi 2: Walk fiber tree __reactFiber$
    if (key.startsWith('__reactFiber$')) {
      const fiber = (element as any)[key]
      let f = fiber
      while (f) {
        const p = f.pendingProps || f.memoizedProps
        if (p?.['data-inspector-relative-path']) {
          return {
            relativePath: p['data-inspector-relative-path'],
            line: p['data-inspector-line'] || '1',
            column: p['data-inspector-column'] || '1',
          }
        }
        // Fallback: _debugSource (React < 19)
        const src = f._debugSource ?? f._debugOwner?._debugSource
        if (src?.fileName && src?.lineNumber) {
          return {
            relativePath: src.fileName,
            line: String(src.lineNumber),
            column: String(src.columnNumber ?? 1),
          }
        }
        f = f.return
      }
    }
  }

  // Strategi 3: Fallback DOM attribute langsung
  const rp = element.getAttribute('data-inspector-relative-path')
  if (rp) {
    return {
      relativePath: rp,
      line: element.getAttribute('data-inspector-line') || '1',
      column: element.getAttribute('data-inspector-column') || '1',
    }
  }

  return null
}

/** Walk up DOM tree sampai ketemu elemen yang punya source info */
function findCodeInfo(target: HTMLElement): CodeInfo | null {
  let el: HTMLElement | null = target
  while (el) {
    const info = getCodeInfoFromElement(el)
    if (info) return info
    el = el.parentElement
  }
  return null
}

function openInEditor(info: CodeInfo) {
  fetch('/__open-in-editor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      relativePath: info.relativePath,
      lineNumber: info.line,
      columnNumber: info.column,
    }),
  })
}

export function DevInspector({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const lastInfoRef = useRef<CodeInfo | null>(null)

  const updateOverlay = useCallback((target: HTMLElement | null) => {
    const ov = overlayRef.current
    const tt = tooltipRef.current
    if (!ov || !tt) return

    if (!target) {
      ov.style.display = 'none'
      tt.style.display = 'none'
      lastInfoRef.current = null
      return
    }

    const info = findCodeInfo(target)
    if (!info) {
      ov.style.display = 'none'
      tt.style.display = 'none'
      lastInfoRef.current = null
      return
    }

    lastInfoRef.current = info

    const rect = target.getBoundingClientRect()
    ov.style.display = 'block'
    ov.style.top = `${rect.top + window.scrollY}px`
    ov.style.left = `${rect.left + window.scrollX}px`
    ov.style.width = `${rect.width}px`
    ov.style.height = `${rect.height}px`

    tt.style.display = 'block'
    tt.textContent = `${info.relativePath}:${info.line}`
    const ttTop = rect.top + window.scrollY - 24
    tt.style.top = `${ttTop > 0 ? ttTop : rect.bottom + window.scrollY + 4}px`
    tt.style.left = `${rect.left + window.scrollX}px`
  }, [])

  // Activate/deactivate event listeners
  useEffect(() => {
    if (!active) return

    const onMouseOver = (e: MouseEvent) => updateOverlay(e.target as HTMLElement)

    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const info = lastInfoRef.current ?? findCodeInfo(e.target as HTMLElement)
      if (info) {
        const loc = `${info.relativePath}:${info.line}:${info.column}`
        console.log('[DevInspector] Open:', loc)
        navigator.clipboard.writeText(loc)
        openInEditor(info)
      }
      setActive(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false)
    }

    document.addEventListener('mouseover', onMouseOver, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown)
    document.body.style.cursor = 'crosshair'

    return () => {
      document.removeEventListener('mouseover', onMouseOver, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.cursor = ''
      if (overlayRef.current) overlayRef.current.style.display = 'none'
      if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    }
  }, [active, updateOverlay])

  // Hotkey: Ctrl+Shift+Cmd+C (macOS) / Ctrl+Shift+Alt+C
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && e.ctrlKey && e.shiftKey && (e.metaKey || e.altKey)) {
        e.preventDefault()
        setActive((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        style={{
          display: 'none',
          position: 'absolute',
          pointerEvents: 'none',
          border: '2px solid #3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          zIndex: 99999,
          transition: 'all 0.05s ease',
        }}
      />
      <div
        ref={tooltipRef}
        style={{
          display: 'none',
          position: 'absolute',
          pointerEvents: 'none',
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          fontSize: '12px',
          fontFamily: 'monospace',
          padding: '2px 6px',
          borderRadius: '3px',
          zIndex: 100000,
          whiteSpace: 'nowrap',
        }}
      />
    </>
  )
}
```

### 4. Backend Endpoint — `/__open-in-editor`

**HARUS ditangani di `onRequest` / sebelum middleware**, bukan sebagai route biasa. Kalau jadi route, akan kena auth middleware dan gagal.

```typescript
// Di entry point server (src/index.tsx), dalam onRequest handler:

if (!isProduction && pathname === '/__open-in-editor' && request.method === 'POST') {
  const { relativePath, lineNumber, columnNumber } = (await request.json()) as {
    relativePath: string
    lineNumber: string
    columnNumber: string
  }
  const file = `${process.cwd()}/${relativePath}`
  const editor = process.env.REACT_EDITOR || 'code'
  const loc = `${file}:${lineNumber}:${columnNumber}`
  const args = editor === 'subl' ? [loc] : ['--goto', loc]
  const editorPath = Bun.which(editor)
  console.log(`[inspector] ${editor} → ${editorPath ?? 'NOT FOUND'} → ${loc}`)
  if (editorPath) {
    Bun.spawn([editor, ...args], { stdio: ['ignore', 'ignore', 'ignore'] })
  } else {
    console.error(`[inspector] Editor "${editor}" not found in PATH. Set REACT_EDITOR in .env`)
  }
  return new Response('ok')
}
```

**Penting — `Bun.which()` sebelum `Bun.spawn()`:**
- `Bun.spawn()` throw native error yang TIDAK bisa di-catch jika executable tidak ada
- `Bun.which()` return null dengan aman → cek dulu sebelum spawn

**Editor yang didukung:**

| REACT_EDITOR     | Editor       | Args                           |
|------------------|--------------|--------------------------------|
| `code` (default) | VS Code      | `--goto file:line:col`         |
| `cursor`         | Cursor       | `--goto file:line:col`         |
| `windsurf`       | Windsurf     | `--goto file:line:col`         |
| `subl`           | Sublime Text | `file:line:col` (tanpa --goto) |

### 5. Frontend Entry — Conditional Import (Zero Production Overhead)

```tsx
// src/frontend.tsx (atau entry point React)
import type { ReactNode } from 'react'

const InspectorWrapper = import.meta.env?.DEV
  ? (await import('./frontend/DevInspector')).DevInspector
  : ({ children }: { children: ReactNode }) => <>{children}</>

const app = (
  <InspectorWrapper>
    <App />
  </InspectorWrapper>
)
```

**Bagaimana zero overhead tercapai:**
- `import.meta.env?.DEV` adalah compile-time constant
- Production build: `false` → dynamic import TIDAK dieksekusi
- Tree-shaking menghapus seluruh `DevInspector.tsx` dari bundle
- Tidak ada runtime check, tidak ada dead code di bundle

### 6. (Opsional) Dedupe React Refresh — Workaround Vite middlewareMode

Jika pakai Vite dalam `middlewareMode` (seperti di Elysia/Express), `@vitejs/plugin-react` v6 bisa inject React Refresh footer dua kali → error "already declared".

```typescript
function dedupeRefreshPlugin(): Plugin {
  return {
    name: 'dedupe-react-refresh',
    enforce: 'post',
    transform(code, id) {
      if (!/\.[jt]sx(\?|$)/.test(id) || id.includes('node_modules')) return null

      const marker = 'import * as RefreshRuntime from "/@react-refresh"'
      const firstIdx = code.indexOf(marker)
      if (firstIdx === -1) return null

      const secondIdx = code.indexOf(marker, firstIdx + marker.length)
      if (secondIdx === -1) return null

      const sourcemapIdx = code.indexOf('\n//# sourceMappingURL=', secondIdx)
      const endIdx = sourcemapIdx !== -1 ? sourcemapIdx : code.length

      const cleaned = code.slice(0, secondIdx) + code.slice(endIdx)
      return { code: cleaned, map: null }
    },
  }
}
```

## Langkah Implementasi di Project Baru

### Prasyarat
- Runtime: Bun
- Server: Elysia (atau framework lain dengan onRequest/beforeHandle)
- Frontend: React + Vite
- `@vitejs/plugin-react` (OXC)

### Step-by-step

1. **Buat `DevInspector.tsx`** — copy komponen dari Bagian 3 ke folder frontend
2. **Tambah `inspectorPlugin()`** — copy fungsi dari Bagian 1 ke file vite config
3. **Atur plugin order** — `inspectorPlugin()` SEBELUM `react()` (Bagian 2)
4. **Tambah endpoint `/__open-in-editor`** — di `onRequest` handler (Bagian 4)
5. **Wrap root app** — conditional import di entry point (Bagian 5)
6. **Set env** — `REACT_EDITOR=code` (atau cursor/windsurf/subl) di `.env`
7. **(Opsional)** Tambah `dedupeRefreshPlugin()` jika pakai Vite `middlewareMode`

### Checklist Verifikasi

- [ ] `inspectorPlugin` punya `enforce: 'pre'`
- [ ] Plugin order: inspector → react (bukan sebaliknya)
- [ ] Endpoint `/__open-in-editor` di LUAR middleware auth
- [ ] `Bun.which(editor)` dipanggil SEBELUM `Bun.spawn()`
- [ ] Conditional import pakai `import.meta.env?.DEV`
- [ ] `REACT_EDITOR` di `.env` sesuai editor yang dipakai
- [ ] Hotkey berfungsi: `Ctrl+Shift+Cmd+C` / `Ctrl+Shift+Alt+C`

## Gotcha & Pelajaran

| Masalah                          | Penyebab                                    | Solusi                                        |
|----------------------------------|---------------------------------------------|-----------------------------------------------|
| Attributes tidak ter-inject      | Plugin order salah                          | `enforce: 'pre'`, taruh sebelum `react()`     |
| `Record<string>` ikut ter-inject | Regex match TypeScript generics             | Cek `charBefore` — skip jika identifier char  |
| `Bun.spawn` crash                | Editor tidak ada di PATH                    | Selalu `Bun.which()` dulu                     |
| Hotkey tidak response            | `e.key` return 'C' (uppercase) karena Shift | Pakai `e.key.toLowerCase()`                   |
| React Refresh duplicate          | Vite middlewareMode bug                     | `dedupeRefreshPlugin()` enforce: 'post'       |
| Endpoint kena auth middleware    | Didaftarkan sebagai route biasa             | Tangani di `onRequest` sebelum routing        |
| `_debugSource` undefined         | React 19 menghapusnya                       | Multi-fallback: reactProps → fiber → DOM attr |

## Adaptasi untuk Framework Lain

### Express/Fastify (bukan Elysia)
- Endpoint `/__open-in-editor`: gunakan middleware biasa SEBELUM auth
- `Bun.spawn` → `child_process.spawn` jika pakai Node.js
- `Bun.which` → `which` npm package jika pakai Node.js

### Next.js
- Tidak perlu — Next.js punya built-in click-to-source
- Tapi jika ingin custom: taruh endpoint di `middleware.ts`, plugin di `next.config.js`

### Remix/Tanstack Start (SSR)
- Plugin tetap sama (Vite-based)
- Endpoint perlu di server entry, bukan di route loader

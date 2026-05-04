# Bun + Vite Single-Port Architecture

Pola untuk menjalankan backend (Bun.serve) dan frontend (React + Vite) pada **satu port** tanpa reverse proxy, menggunakan Vite `middlewareMode`. Referensi file path (`src/index.tsx`, `src/serve.ts`, dll) adalah konvensi — ganti sesuai struktur project kamu.

---

## Konsep Inti

Normalnya Vite menjalankan dev server sendiri di port 5173. Di arsitektur ini, Vite **tidak punya port** — dia dijalankan sebagai middleware object yang dipanggil dari dalam `fetch` handler Bun.serve. Semua traffic masuk lewat satu port, lalu di-routing secara internal.

```
Browser → port <PORT> (Bun.serve)
              │
              ▼  serveFrontend() — dipanggil dari fetch
        isApiRoute(pathname)?
         /api/*, /ws, ... (sesuai project)
              │
         YES  │  NO
              ▼  ▼
         routes  serveFrontend()
         object      │
                DEV: Vite middleware
               PROD: static files dari dist/
```

---

## Cara Kerja

### 1. Vite dijalankan dalam `middlewareMode`

Vite dibuat inline di `src/index.tsx` — tidak ada file terpisah:

```ts
// src/index.tsx (boot section)
const isProduction = process.env.NODE_ENV === "production";

import type { ViteDevServer } from "vite";
let vite: ViteDevServer | null = null;

if (!isProduction) {
  const hotData = (import.meta as any).hot?.data ?? {};
  if (hotData.vite) {
    // Reuse Vite instance dari HMR hot data (bun --hot restart)
    vite = hotData.vite as ViteDevServer;
  } else {
    const { createServer } = await import("vite");
    vite = await createServer({});
    if ((import.meta as any).hot) (import.meta as any).hot.data.vite = vite;
  }
  if ((import.meta as any).hot) {
    (import.meta as any).hot.dispose(() => { /* keep vite alive via hot.data */ });
  }
}
```

Vite config (`vite.config.ts`):

```ts
export default defineConfig({
  root: "src",
  publicDir: false,
  plugins: [inspectorPlugin(), react()],
  server: {
    middlewareMode: true,    // ← tidak buka port, hanya expose middleware handler
    hmr: { port: 24678 },    // ← HMR WebSocket di port terpisah
  },
  appType: "custom",         // ← Vite tidak inject HTML fallback otomatis
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
```

### 2. Bun.serve dengan `fetch` + `routes`

Tidak pakai Elysia. Bun.serve langsung menangani semuanya:

```ts
// src/index.tsx
serve({
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  idleTimeout: 0,

  fetch: (req) => serveFrontend(req),  // fallback untuk non-matching routes

  routes: {
    "/ws":          (req) => { /* WebSocket upgrade */ },
    "/api/health":  req  => Response.json({ ok: true }),
    "/api/data":    req  => { /* handler */ },
    // ... tambahkan route API/WS sesuai project
    "/api/*": () => Response.json({ error: "Not found" }, { status: 404 }),
  },
});
```

**Routing priority**: Bun.serve `routes` object match duluan. Jika tidak ada route yang match, jatuh ke `fetch: (req) => serveFrontend(req)` — ini yang menangani semua request frontend (SPA, asset Vite, static file).

### 3. `serveFrontend()` — Dev vs Production

```ts
async function serveFrontend(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!isProduction && vite) {
    // SPA route (no file extension, not Vite-internal) → transform index.html
    if (!pathname.includes(".") && !pathname.startsWith("/@")) {
      let html = fs.readFileSync(path.join(vite.config.root, "index.html"), "utf-8");
      html = await vite.transformIndexHtml(pathname, html, request.url);
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // JS/TS/CSS module request → vite.transformRequest() langsung
    const TRANSFORMABLE = /\.(tsx?|jsx?|css|less|scss|sass|styl)(\?|$)/;
    if (TRANSFORMABLE.test(pathname) || pathname.startsWith("/@") || pathname.startsWith("/.vite/")) {
      const result = await vite!.transformRequest(pathname + url.search, { ssr: false });
      if (result) {
        return new Response(result.code, {
          headers: { "Content-Type": "application/javascript; charset=utf-8" },
        });
      }
    }

    // Static asset (image, font, etc.) → serve from Vite root
    const assetPath = path.join(vite!.config.root, pathname);
    if (fs.existsSync(assetPath)) {
      return new Response(Bun.file(assetPath), { headers });
    }

    return new Response("Not Found", { status: 404 });
  }

  // Production: static files from dist/ + SPA fallback
  const safePath = pathname.replace(/\.\./g, "");
  const filePath = path.join("dist", safePath === "/" ? "index.html" : safePath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const headers: Record<string, string> = {};
    if (MIME[ext]) headers["Content-Type"] = MIME[ext];
    if (safePath.startsWith("/assets/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
    return new Response(Bun.file(filePath), { headers });
  }
  return new Response(Bun.file("dist/index.html"), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
```

**Kenapa tidak perlu bridge Node.js?** `vite.transformRequest()` menerima URL string dan return `{ code, map }` — ini pure function, tidak butuh `IncomingMessage`/`ServerResponse`. Untuk SPA routes, `vite.transformIndexHtml()` juga pure function. Satu-satunya skenario yang butuh bridge adalah asset non-transformable (font, image) — itupun langsung di-serve dengan `Bun.file()`.

---

## Port yang Terlibat

| Port | Siapa | Keterangan |
|---|---|---|
| `8080` (atau `PORT` env) | Bun.serve | Satu-satunya port yang terbuka untuk traffic HTTP |
| `24678` | Vite HMR | WebSocket Hot Module Replacement (dev only, tidak perlu dibuka ke publik) |

> Port Bun.serve bebas — ganti sesuai kebutuhan via `PORT` env. Port Vite HMR (`24678`) internal dan tidak butuh expose ke luar.

---

## Lifecycle Dev Server (`src/serve.ts`)

Ada masalah Bun-specific: `SO_REUSEPORT` memungkinkan dua proses binding ke port yang sama. Kalau `bun --hot` restart saat proses lama masih hidup, traffic akan tersplit antara dua proses — API bisa 404 di proses yang salah.

```ts
// src/serve.ts
const PID_FILE = "./state/server.pid";

function isAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true; }
  catch { return false; }
}

fs.mkdirSync(path.dirname(PID_FILE), { recursive: true });
if (fs.existsSync(PID_FILE)) {
  const prev = Number(fs.readFileSync(PID_FILE, "utf-8").trim());
  if (Number.isFinite(prev) && prev !== process.pid && isAlive(prev)) {
    process.kill(prev, "SIGTERM");
    Bun.sleepSync(80);  // beri waktu proses lama cleanup
  }
}
fs.writeFileSync(PID_FILE, String(process.pid));
process.on("exit", () => { try { fs.unlinkSync(PID_FILE); } catch {} });

// Dynamic import delays one microtask — lets kernel release the old socket
await import("./index.tsx");
```

**Kenapa `await import("./index.tsx")`?** Dynamic import delay satu microtask memberi waktu kernel melepas socket lama. Tanpa ini, Bun bisa kena `EADDRINUSE` saat HMR restart.

**Kenapa reuse Vite via `hot.data`?** `bun --hot` restart module tree tapi Vite instance bisa di-pass lewat `import.meta.hot.data`. Tanpa ini, setiap restart bikin Vite instance baru yang lambat (re-scan module graph).

---

## Production Mode: Static Files

Di production, Vite tidak jalan sama sekali. `serveFrontend()` langsung serve file dari `dist/`:

- File di `/assets/` punya content hash di nama → `Cache-Control: immutable` (1 tahun)
- Route SPA (tanpa ekstensi file) → `dist/index.html` dengan `Cache-Control: no-cache`
- Path traversal dicegah: `pathname.replace(/\.\./g, "")`

---

## Dependency

Tidak ada dependency tambahan di luar yang sudah ada:

- **Bun** — HTTP server (`Bun.serve`), file serving (`Bun.file`)
- **Vite** — `createServer` dengan `middlewareMode: true`
- `node:fs`, `node:path` — static file + PID file

---

## Verifikasi

| Tes | Yang Diharapkan |
|---|---|
| `GET /` | HTML dengan HMR script ter-inject (dev) |
| `GET /api/<endpoint>` | JSON response dari Bun.serve route |
| `GET /src/App.tsx?t=123` | JS module dari Vite transform (dev) |
| Edit komponen → save | Browser hot-reload tanpa full refresh |
| `GET /` di production | HTML dari `dist/index.html` |
| `GET /assets/index-abc123.js` | JS dengan `Cache-Control: immutable` |
| `GET /<spa-route>` | `dist/index.html` (SPA fallback) |
| Jalankan `bun dev` dua kali | Proses lama ter-kill, tidak ada split traffic |

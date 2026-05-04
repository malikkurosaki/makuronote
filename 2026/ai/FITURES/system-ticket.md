# Sistem Tiket Internal

## Ringkasan

Sistem pelacakan bug/fitur internal untuk tim pengembang. Terintegrasi penuh
dari database hingga MCP tools — tiket bisa dikelola lewat dashboard web
maupun langsung dari sesi Claude Code via MCP.

Dirancang khusus untuk **satu operator (platform_admin)** yang mengelola
banyak desa. Tiket bisa dikaitkan ke desa tertentu, ke trace observability,
dan ke URL halaman tempat issue terjadi.

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                          BACKEND                  │
│                                                              │
│  /platform/tiket                                              │
│  ┌──────────────────┐          ┌─────────────────────┐       │
│  │ TiketPage         │          │ API Routes          │       │
│  │ ├─ TiketList      │  HTTP    │ /api/tickets        │       │
│  │ ├─ TiketDetail    │ ◄──────► │ ├─ GET / (list)     │       │
│  │ ├─ TiketForm      │  JSON    │ ├─ GET /:id         │       │
│  │ ├─ MarkdownEditor │          │ ├─ POST / (create)  │       │
│  │ └─ constants.ts   │          │ ├─ PUT /:id         │       │
│  └──────────────────┘          │ ├─ DELETE /:id      │       │
│                                 │ ├─ POST /bulk-delete│       │
│  Hooks (useApi.ts)              │ ├─ POST /:id/comments│      │
│  ├─ useTicketList               │ ├─ GET /export/csv  │       │
│  ├─ useTicketDetail             │ ├─ GET /summary/counts│     │
│  ├─ useTicketSummary            │ ├─ GET /img/*       │       │
│  ├─ useCreateTicket             │ ├─ POST /upload-temp│       │
│  ├─ useUpdateTicket             │ ├─ POST /:id/upload │       │
│  ├─ useDeleteTicket             │ └─ GET /:id/attachments│    │
│  ├─ useBulkDeleteTickets        └─────────────────────┘       │
│  ├─ useAddTicketComment                  │                    │
│  ├─ useUploadTicketAttachment            │                    │
│  └─ useTicketAttachments                 ▼                    │
│                                ┌─────────────────────┐       │
│  MCP TOOLS                     │  Prisma Models       │       │
│  ├─ list_tickets               │  Ticket             │       │
│  ├─ get_ticket                 │  TicketComment      │       │
│  ├─ update_ticket              └─────────────────────┘       │
│  └─ add_ticket_comment                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Model Data

### `Ticket` (tabel `ticket`)

| Field | Tipe | Default | Keterangan |
|---|---|---|---|
| `id` | UUID | auto | Primary key |
| `nomor` | Int (auto-increment) | auto | Nomor urut, ditampilkan sebagai `TKT-NNNN` |
| `judul` | String | required | Judul tiket |
| `deskripsi` | String (markdown) | required | Deskripsi masalah/fitur |
| `kategori` | String | `"bug"` | `bug`, `ui`, `ai`, `performa`, `fitur`, `lainnya` |
| `prioritas` | String | `"medium"` | `critical`, `high`, `medium`, `low` |
| `status` | String | `"open"` | `open`, `in_progress`, `resolved`, `closed`, `reopened` |
| `url` | String? | null | URL halaman tempat issue terjadi |
| `trace_id` | String? | null | Link ke trace observability (`trc_xxx`) |
| `lampiran` | Json | `[]` | Array path objek MinIO (gambar) |
| `catatan_resolusi` | String? | null | Catatan saat resolve/close |
| `desa_id` | String? | null | FK ke Desa (optional) |
| `created_by` | String | required | FK ke User (pembuat) |
| `assigned_to` | String? | null | FK ke User (developer yang mengerjakan) |
| `resolved_at` | DateTime? | null | Timestamp saat status jadi `resolved` |
| `closed_at` | DateTime? | null | Timestamp saat status jadi `closed` |
| `created_at` | DateTime | `now()` | Timestamp pembuatan |
| `updated_at` | DateTime | updatedAt | Timestamp update terakhir |

**Relasi:**
- `creator` → User (via `ticket_creator`)
- `assignee` → User? (via `ticket_assignee`)
- `desa` → Desa?
- `comments` → TicketComment[] (cascade delete)

**Index:**
- `[status, prioritas]`
- `[created_by]`
- `[assigned_to]`
- `[desa_id]`
- `[created_at DESC]`

### `TicketComment` (tabel `ticket_comment`)

| Field | Tipe | Default | Keterangan |
|---|---|---|---|
| `id` | UUID | auto | Primary key |
| `ticket_id` | String | required | FK ke Ticket (cascade delete) |
| `user_id` | String | required | FK ke User (penulis) |
| `isi` | String (markdown) | required | Isi komentar |
| `lampiran` | Json | `[]` | Array path objek MinIO |
| `created_at` | DateTime | `now()` | Timestamp |

---

## State Machine Tiket

```
        ┌──────────────────────────────────────┐
        │                                      │
        ▼                                      │
     ┌──────┐    ┌─────────────┐    ┌──────────┐    ┌────────┐
     │ open │───►│ in_progress │───►│ resolved │───►│ closed │
     └──────┘    └─────────────┘    └──────────┘    └────────┘
        ▲              │                  │              │
        │              │                  │              │
        └──────────────┴──────────────────┴──────────────┘
                     reopen              reopen

Transisi:
  open → in_progress  : Developer mengambil tiket (assign ke diri sendiri)
  in_progress → resolved : Fix selesai, isi catatan_resolusi
  resolved → closed    : Tiket diverifikasi, ditutup permanen
  resolved → reopened  : Issue belum sepenuhnya selesai
  closed → reopened     : Issue muncul kembali
  open → resolved       : Bisa langsung resolve (skip in_progress)
  open → closed         : Bisa langsung close (tiket tidak valid)
```

**Side-effects otomatis:**
- Status → `resolved` : set `resolved_at = now()`
- Status → `closed` : set `closed_at = now()`
- Assign ke user via "Ambil tiket ini" : set `status = in_progress` + `assigned_to`

---

## Akses & Otorisasi

### Role hierarchy

```
operator_desa (1) < sekretaris_desa (2) < kepala_desa (3) < qc (4) < platform_admin (5)
```

### Siapa yang bisa akses?

| Role | Akses | Catatan |
|---|---|---|
| `platform_admin` | Full | Semua operasi termasuk delete & bulk delete |
| `qc` (quality control) | Full kecuali delete | Flag `is_qc=true` di User — role khusus tester/QA |
| Staff desa (1-3) | **Tidak bisa** | `requireRole('qc')` memblokir role di bawah 4 |
| Warga | **Tidak bisa** | Tidak ada endpoint publik |

### Batasan operasi

| Operasi | Minimal role |
|---|---|
| List, detail, create, update, komentar | `qc` (level 4) |
| Delete satu tiket | `platform_admin` (level 5) |
| Bulk delete | `platform_admin` (level 5) |
| Export CSV | `qc` (level 4) |

### Frontend guard

Route `/platform/tiket` dicek di parent `route.tsx`:
- Harus `platform_admin` ATAU `is_qc === true`
- User QC diblokir dari halaman admin sensitif (`/platform/pengguna`, `/platform/pengaturan`, `/platform/whatsapp-server`) tapi **bisa** akses tiket

### Visibility di sidebar

Item "Tiket" di AppShell hanya muncul untuk platform admin (termasuk QC).
Badge counter menampilkan jumlah tiket `open + in_progress`, polling setiap 30 detik.

---

## API Endpoints

Semua endpoints di-mount di prefix `/tickets`, terdaftar sebagai `/api/tickets`.

### List & Detail

| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/tickets` | List tiket dengan filter, search, pagination |
| `GET` | `/api/tickets/:id` | Detail tiket + komentar + rewrite URL lampiran |
| `GET` | `/api/tickets/summary/counts` | Ringkasan jumlah `open` + `in_progress` |
| `GET` | `/api/tickets/export/csv` | Export CSV dengan filter yang sama |

### Mutasi

| Method | Path | Keterangan |
|---|---|---|
| `POST` | `/api/tickets` | Buat tiket baru |
| `PUT` | `/api/tickets/:id` | Update tiket (semua field opsional) |
| `DELETE` | `/api/tickets/:id` | Hapus tiket + komentar (admin only) |
| `POST` | `/api/tickets/bulk-delete` | Hapus banyak tiket sekaligus |

### Komentar

| Method | Path | Keterangan |
|---|---|---|
| `POST` | `/api/tickets/:id/comments` | Tambah komentar |

### Upload & Gambar

| Method | Path | Keterangan |
|---|---|---|
| `POST` | `/api/tickets/upload-temp` | Upload gambar sementara (sebelum tiket dibuat) |
| `POST` | `/api/tickets/:id/upload` | Upload lampiran ke tiket existing |
| `GET` | `/api/tickets/img/*` | Proxy URL stabil untuk gambar MinIO (redirect ke presigned URL) |
| `GET` | `/api/tickets/:id/attachments` | Dapatkan presigned URL semua lampiran |

### Query params untuk list

| Param | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | number | 1 | Halaman |
| `limit` | number | 20 (max 100) | Item per halaman |
| `status` | string | - | `open`, `in_progress`, `resolved`, `closed`, `reopened` |
| `prioritas` | string | - | `critical`, `high`, `medium`, `low` |
| `kategori` | string | - | `bug`, `ui`, `ai`, `performa`, `fitur`, `lainnya` |
| `assigned_to` | string | - | Filter by assignee user ID |
| `created_by` | string | - | Filter by creator user ID |
| `desa_id` | string | - | Filter by desa |
| `search` | string | - | Cari di judul + deskripsi + nomor (`TKT-0001`, `TKT0001`, `1`) |
| `from` | ISO date | - | Rentang tanggal dibuat |
| `to` | ISO date | - | Rentang tanggal dibuat |
| `sort` | string | `created_at` | Field sort |
| `dir` | string | `desc` | Arah sort |

---

## Komponen Frontend

Semua komponen di `src/frontend/components/tiket/`:

### `TiketPage.tsx` — Orchestrator

Tiga state yang dikontrol oleh search params URL (`?tiket=<id>&mode=create`):

1. **List view** (default): `TiketList` + tombol "Buat Tiket" + badge counter
2. **Detail view** (`?tiket=<uuid>`): `TiketDetail` + tombol kembali
3. **Create form** (`?mode=create`): `TiketForm` + header

State dikelola via TanStack Router search params — bukan `useState` lokal.
Ini memastikan URL bisa di-bookmark dan back button bekerja natural.

### `TiketList.tsx` — Tabel & Filter

- **Search bar**: debounce 300ms, support nomor tiket (`TKT-0001`) dan teks
- **Filter row**: dropdown status, dropdown prioritas, rentang tanggal (from/to)
- **Sort**: klik header kolom (No. Tiket, Status, Prioritas, Tanggal), toggle asc/desc
- **Pagination**: komponen Mantine Pagination
- **Bulk actions**: checkbox + select-all + modal konfirmasi hapus (admin only)
- **Export CSV**: dropdown menu di header
- **Kolom tabel**: nomor (monospace + copy), judul (dengan badge komentar + nama desa), status (colored badge), prioritas (colored badge), kategori (outline badge), pembuat (avatar + nama), ditangani (avatar + nama atau "-"), tanggal (short format)
- **Empty state**: kertas tengah dengan teks "Tidak ada tiket ditemukan"

### `TiketDetail.tsx` — Detail & Edit

**Mode View (default):**
- Header: tombol back, nomor tiket monospace, badge status/prioritas/kategori
- Info pembuat: avatar + nama + timestamp
- Badge desa (jika terkait desa)
- Deskripsi: render markdown via `MarkdownPreview`
- Link URL (jika ada)
- Grid thumbnail lampiran (klik buka di tab baru)
- Action bar: dropdown ubah status, tombol "Ambil tiket ini" (jika belum ada assignee)
- Timeline komentar: komponen Mantine Timeline — avatar, nama, timestamp, isi markdown
- Input komentar: `MarkdownEditor` + tombol "Kirim"

**Mode Edit:**
- Inline form: judul, dropdown kategori/prioritas, input URL, MarkdownEditor deskripsi
- Tombol Simpan / Batal
- Hanya pembuat tiket yang bisa edit

**Delete:** modal konfirmasi Mantine dengan peringatan — admin only

### `TiketForm.tsx` — Buat Tiket

- Judul (required)
- Deskripsi (required) — `MarkdownEditor`
- Kategori — dropdown 6 opsi: `bug`, `ui`, `ai`, `performa`, `fitur`, `lainnya`
- Prioritas — dropdown 4 opsi: `critical`, `high`, `medium`, `low`
- Desa terkait — searchable select dari `useDesaList()` (optional)
- URL terkait — input teks (optional)
- Submit → `useCreateTicket()` mutation → `onSuccess` callback

### `MarkdownEditor.tsx` — Editor + Preview

- Library: `@uiw/react-md-editor` (lazy load)
- Dua export: `MarkdownEditor` (editable) dan `MarkdownPreview` (read-only)
- **Paste image support**: deteksi gambar di clipboard → upload otomatis → sisipkan markdown image
- Upload path berbeda: temp (sebelum tiket ada ID) vs `/api/tickets/:id/upload` (setelah ada ID)
- URL stabil via proxy `/api/tickets/img/*`
- Dark mode aware (ikut Mantine color scheme)

### `constants.ts` — Shared Constants

```typescript
STATUS_COLOR    = { open: 'blue', in_progress: 'yellow', resolved: 'green',
                    closed: 'gray', reopened: 'orange' }
PRIORITAS_COLOR = { critical: 'red', high: 'orange', medium: 'yellow', low: 'gray' }
KATEGORI_COLOR  = { bug: 'red', ui: 'violet', ai: 'cyan', performa: 'orange',
                    fitur: 'green', lainnya: 'gray' }
formatTicketNo(n: number) → "TKT-0001"  // padded 4 digit
```

---

## Layanan Gambar (Upload & Proxy)

### Alur upload

```
1. User paste gambar di MarkdownEditor
2. Clipboard API deteksi image
3. Upload ke endpoint:
   - Tiket belum dibuat → POST /api/tickets/upload-temp
     → MinIO path: ticket/temp-{timestamp}/lampiran-{random}.jpg
   - Tiket sudah ada   → POST /api/tickets/:id/upload
     → MinIO path: ticket/{ticketId}/lampiran-{index}-{timestamp}.jpg
4. Kompres via sharp: max 1280px width, JPEG quality 80%
5. Max file size: 5MB
6. URL gambar di markdown: /api/tickets/img/{objectName}
```

### Proxy URL stabil

```
Markdown tersimpan:  ![gambar](/api/tickets/img/lampiran-abc123.jpg)
                          │
                          ▼
GET /api/tickets/img/lampiran-abc123.jpg
                          │
                          ▼
                 Generate presigned URL MinIO (TTL 1 jam)
                          │
                          ▼
                 302 Redirect ke presigned URL
```

Ini memastikan URL di markdown tidak expired — proxy selalu generate
presigned URL baru setiap kali gambar diakses.

---

## Infrastruktur MCP — Cara Koneksi ke Staging

Tiket bisa dikelola dari Claude Code melalui dua server MCP yang
didefinisikan di `.mcp.json`. Masing-masing punya cara koneksi berbeda.

### `.mcp.json` — Dua server, dua transport

```json
{
  "mcpServers": {
    "desa-platform-local": {
      "command": "bun",
      "args": ["run", "scripts/mcp/server.ts"],
      "description": "Living MCP — runtime access ke traces, desa config, AI session, warga (DB lokal)"
    },
    "desa-platform-stg": {
      "type": "http",
      "url": "https://desa-platform.wibudev.com/mcp",
      "headers": { "Authorization": "Bearer ${MCP_SECRET}" }
    }
  }
}
```

| Server | Transport | Target | Kapan dipakai |
|---|---|---|---|
| `desa-platform-local` | **stdio** — process Bun lokal, stdin/stdout JSON-RPC | Database development lokal | Development & debugging |
| `desa-platform-stg` | **HTTP** — POST ke endpoint `/mcp` di staging | Database staging via internet | Cek tiket di staging tanpa SSH |

### Cara kerja `desa-platform-stg` (HTTP transport)

```
┌──────────────────────────────────────────────────────────┐
│  Claude Code Session                                     │
│                                                          │
│  Tool call: mcp__desa-platform-stg__list_tickets         │
│       │                                                  │
│       ▼                                                  │
│  HTTP POST https://desa-platform.wibudev.com/mcp         │
│  Headers:                                                │
│    Authorization: Bearer ${MCP_SECRET}                   │
│    Content-Type: application/json                        │
│  Body:                                                   │
│    {                                                     │
│      "jsonrpc": "2.0",                                   │
│      "method": "tools/call",                             │
│      "params": {                                         │
│        "name": "list_tickets",                           │
│        "arguments": { "status": "open" }                 │
│      }                                                   │
│    }                                                     │
│       │                                                  │
│       ▼                                                  │
│  ┌──────────────────────────────────────────┐            │
│  │  Staging Server (desa-platform.wibudev.com)│           │
│  │                                          │            │
│  │  Elysia route: ALL /mcp, /mcp/*          │            │
│  │       │                                  │            │
│  │       ▼                                  │            │
│  │  checkAuth(request)                      │            │
│  │  ├─ MCP_SECRET belum dikonfigurasi? → 503│            │
│  │  └─ Authorization != Bearer <secret>? → 401         │
│  │       │                                  │            │
│  │       ▼                                  │            │
│  │  WebStandardStreamableHTTPServerTransport│            │
│  │  ├─ Session management (in-memory Map)   │            │
│  │  ├─ Inisialisasi: buat session baru     │            │
│  │  └─ Subsequent: pakai session ID         │            │
│  │       │                                  │            │
│  │       ▼                                  │            │
│  │  MCP Server ← TOOLS (sama dengan local)  │            │
│  │  ├─ prisma (koneksi DB staging)          │            │
│  │  ├─ redis (koneksi Redis staging)        │            │
│  │  └─ handleToolCall(deps, name, args)     │            │
│  │       │                                  │            │
│  │       ▼                                  │            │
│  │  JSON Response → Claude Code             │            │
│  └──────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────┘
```

### Syarat koneksi

| Syarat | Keterangan |
|---|---|
| `MCP_SECRET` env var | Harus diset di environment Claude Code, nilainya sama dengan yang ada di server staging |
| `Authorization: Bearer <secret>` header | Di-inject otomatis oleh Claude Code dari `${MCP_SECRET}` di `.mcp.json` |
| Koneksi internet | Server staging bisa diakses publik di `desa-platform.wibudev.com` |
| Endpoint `/mcp` | Harus hidup di staging (mount di `src/routes/mcp.ts`) |

### Session lifecycle

```
1. Claude Code → POST /mcp (tanpa session ID)
   → Server buat session baru → return response + header mcp-session-id

2. Claude Code → POST /mcp (dengan mcp-session-id header)
   → Server cek Map sessions.get(id) → pakai transport yang sama

3. Session expired / server restart
   → Map sessions hilang → return 404 "Session expired"
   → Claude Code otomatis re-inisialisasi session baru
```

Session disimpan di **in-memory Map** di server — bukan di Redis/database.
Artinya session akan hilang jika server restart atau deploy ulang. Claude Code
akan otomatis membuat session baru saat mendeteksi response 404.

### Perbedaan local vs staging

| Aspek | `desa-platform-local` | `desa-platform-stg` |
|---|---|---|
| Transport | stdio (process lokal) | HTTP (network) |
| Latensi | ~0ms (lokal) | ~50-300ms (tergantung jaringan) |
| Database | Development (lokal) | Staging (production-like) |
| Auth | Tidak perlu (process lokal) | Bearer token (`MCP_SECRET`) |
| Tool yang tersedia | 40+ (semua) | 40+ (semua kecuali simulasi chat) |
| Session | Seumur process | In-memory Map, bisa expired |
| Use case | Development & debugging | Cek data staging, verifikasi deploy |

---

## Empat MCP Tool Tiket

Tiket bisa dikelola langsung dari sesi Claude Code via 4 MCP tools.
Tersedia di kedua environment di atas.

### `list_tickets`

List tiket dengan filter. Default: status=`open`.

```
Params:  status, kategori, prioritas, limit
Returns: { count, filter, tickets[] }
         tickets[].ticket_no = "TKT-0001"
```

### `get_ticket`

Detail tiket lengkap dengan semua komentar.

```
Params:  ticket_id (UUID) ATAU nomor (integer)
Returns: Ticket + creator + assignee + desa + comments[] (dengan user info)
```

### `update_ticket`

Update status, prioritas, kategori, judul, deskripsi, assignee.

```
Params:  ticket_id ATAU nomor, field yang mau diupdate
Returns: { ok, ticket }
Writes:  Audit log (tool: update_ticket, entity: ticket)
```

### `add_ticket_comment`

Tambah komentar ke tiket.

```
Params:  ticket_id ATAU nomor, isi (required), actor_user_id
Returns: { ok, comment, ticket_no }
Writes:  Audit log (tool: add_ticket_comment, entity: ticket_comment)
```

### Perbedaan MCP vs API

| Aspek | API endpoint | MCP tool |
|---|---|---|
| Auth | Session Better Auth | Tidak perlu (sudah dalam sesi Claude) |
| Audit log | Tergantung endpoint | Semua write-op menulis audit log |
| Actor | Dari session user | Dari `actor_user_id` parameter |
| Use case | Dashboard web | Debugging & manajemen dari Claude |

---

## Hooks (TanStack Query)

Semua hooks di `src/frontend/hooks/useApi.ts`:

| Hook | Key | Keterangan |
|---|---|---|
| `useTicketList(filters)` | `['tickets', filters]` | List terfilter + paginasi |
| `useTicketDetail(id)` | `['ticket', id]` | Detail (enabled jika id ada) |
| `useTicketSummary(enabled)` | `['tickets', 'summary']` | Counter open/in_progress, polling 30s |
| `useCreateTicket()` | mutation | POST, invalidasi `['tickets']` |
| `useUpdateTicket()` | mutation | PUT, invalidasi `['tickets']` + `['ticket', id]` |
| `useDeleteTicket()` | mutation | DELETE, invalidasi `['tickets']` |
| `useBulkDeleteTickets()` | mutation | POST bulk-delete, invalidasi `['tickets']` |
| `useAddTicketComment()` | mutation | POST comment, invalidasi `['ticket', id]` |
| `useUploadTicketAttachment()` | mutation | POST upload, invalidasi ticket + attachments |
| `useTicketAttachments(id)` | `['ticket', id, 'attachments']` | Presigned URLs (enabled jika id ada) |

---

## Format Nomor Tiket

```
Database:  nomor = 1 (integer auto-increment)
Display:   TKT-0001  (zero-padded 4 digit)
Search:    "TKT-0001", "TKT0001", atau "1" → semua resolve ke nomor yang sama

Fungsi:    formatTicketNo(n: number): string
           → `TKT-${String(n).padStart(4, '0')}`
```

Tombol copy di samping nomor tiket di list → copy `TKT-0001` ke clipboard.

---

## Rangkuman File

| File | Peran |
|---|---|
| `prisma/schema.prisma` (L1336-1386) | Model Ticket + TicketComment |
| `src/routes/api/ticket.ts` | 13 endpoint API |
| `src/routes/api/index.ts` (L114) | Registrasi route `/tickets` |
| `src/middleware/rbac.ts` | Middleware `requireRole('qc')` |
| `src/lib/types/auth.ts` | Role hierarchy definition |
| `src/services/media.ts` (L163-195) | Upload gambar + presigned URL |
| `src/lib/mcp-tools.ts` | Definisi tool MCP + handler read + dispatch |
| `src/lib/mcp-handlers.ts` (L123-219) | Handler MCP write (update, comment) |
| `src/frontend/routes/platform/tiket.tsx` | Route `/platform/tiket` |
| `src/frontend/routes/platform/route.tsx` | Parent guard (platform_admin / qc) |
| `src/frontend/components/TiketPage.tsx` | Orchestrator list/detail/form |
| `src/frontend/components/tiket/TiketList.tsx` | Tabel + filter + bulk actions |
| `src/frontend/components/tiket/TiketDetail.tsx` | Detail + edit + komentar |
| `src/frontend/components/tiket/TiketForm.tsx` | Form buat tiket |
| `src/frontend/components/tiket/MarkdownEditor.tsx` | Editor markdown + paste image |
| `src/frontend/components/tiket/constants.ts` | Warna, label, formatTicketNo |
| `src/frontend/components/AppShell.tsx` | Nav item + badge counter |
| `src/frontend/hooks/useApi.ts` (L3617-3783) | 11 React Query hooks |

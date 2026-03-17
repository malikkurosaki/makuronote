# CLAUDE.md — Jenna AI

Dokumen ini adalah panduan konteks proyek untuk Claude Code.
Baca seluruh file ini sebelum menulis kode apapun.

---

## Visi Proyek

**Jenna AI** adalah platform SaaS multi-tenant yang menggantikan birokrasi
pelayanan desa konvensional dengan AI berbasis WhatsApp dan Telegram.
Target pengguna adalah seluruh desa di Indonesia — bukan hanya Bali.

### Layanan utama

- Chat AI 24/7 untuk warga via WhatsApp dan Telegram
- Pengajuan surat desa otomatis via percakapan (domisili, SKCK, keterangan
  tidak mampu, pengantar BPJS, dll)
- Form wizard berbasis web (HTMX) untuk input data kompleks — dikirim
  via link dari bot WA
- Pelaporan warga (jalan rusak, lampu mati, sampah) dengan sistem tiket
- Handoff ke petugas manusia saat AI tidak mampu menangani
- Dashboard admin untuk aparat desa (kepala desa + operator)
- Notifikasi internal petugas via Ntfy

### Yang sengaja tidak ada di MVP

- Broadcast WA massal — rawan ban, direncanakan pakai WA Business API
  resmi di masa mendatang
- Billing / paket — dibahas di iterasi berikutnya
- SEO / SSR — bukan prioritas, ditangani kemudian hari

---

## Nama & Identitas

| | |
|---|---|
| Nama AI | Jenna AI |
| Brand platform | Jenna AI |
| Operator | wibudev (Malik) |
| Domain | wibudev.com |
| Server | srv442857 |

---

## Arsitektur Sistem

### Pendekatan: Monorepo, FE dan BE terpisah tapi satu proses

```
jenna-ai/
├── apps/
│   └── api/                  ← Bun + Elysia (backend utama)
│       └── src/
│           ├── index.tsx     ← entry point Elysia + serve dashboard React
│           ├── frontend.tsx  ← Dashboard React entry (bun --react)
│           ├── webhook/      ← WA + Telegram handler
│           ├── ai/           ← Jenna AI engine, RAG, state machine
│           ├── forms/        ← HTMX wizard routes (form warga)
│           └── jobs/         ← BullMQ async jobs
├── packages/
│   ├── db/                   ← Prisma schema + client (shared)
│   └── types/                ← Shared types, Eden treaty
├── docker-compose.yml
├── turbo.json
└── CLAUDE.md
```

Tooling monorepo: **Turborepo**.

Dashboard admin jalan **satu proses dengan Elysia** via `bun init --react`.
Tidak ada apps/web atau apps/dashboard sebagai project terpisah.

### Flow data utama

```
Warga (WhatsApp / Telegram)
  → Webhook Handler (Elysia)
  → Rate Limiter (Redis)
  → Conversation State Machine (Redis)
  → Jenna AI Engine (Claude via abstraksi provider)
  → RAG: pgvector similarity search
  → Response ke warga via Evolution API / Telegram Bot
  → Jika form kompleks: kirim link HTMX wizard
  → Jika perlu petugas: handoff + Ntfy alert ke petugas
```

---

## Tech Stack

### Backend — `apps/api`

| Teknologi | Keterangan |
|---|---|
| Runtime | **Bun** — bukan Node.js. Gunakan Bun API bawaan bila ada |
| Framework | **Elysia** — native Bun, bukan Hono, bukan Express |
| Validasi | **Elysia `t` (TypeBox)** — bukan Zod, sudah built-in Elysia |
| ORM | **Prisma** — schema di `packages/db` |
| Queue | **BullMQ + ioredis** — async: generate PDF, kirim notif |
| Auth | **JWT** via `@elysiajs/bearer` |
| PDF | **`pdf-lib`** — generate surat. Puppeteer hanya jika template HTML kompleks |
| Image | **`sharp`** — kompresi foto lampiran warga |
| HTML template | **`@elysiajs/html`** — render HTMX form dari server |

### Dashboard Admin — dalam `apps/api`

| Teknologi | Keterangan |
|---|---|
| Setup | **`bun init --react`** — React + Elysia satu proses |
| UI | **shadcn/ui** — komponen dashboard |
| Data fetching | **Eden Treaty** — type-safe client dari Elysia, tanpa codegen |
| State | React built-in + TanStack Query untuk data server |

### Form Warga — HTMX (dalam `apps/api/src/forms/`)

| Teknologi | Keterangan |
|---|---|
| Rendering | **HTMX + `@elysiajs/html`** — server-side render, bukan SPA |
| Interaktivitas | **HTMX** — swap konten per step tanpa full reload |
| Session | **Redis** — progress wizard, TTL 30 menit, key dari token link WA |
| Pola | Wizard linear: satu pertanyaan per step, pre-filled dari data chat |

Kenapa HTMX bukan React untuk form warga:
- Tidak ada build step, tidak ada blank screen, jalan di HP Android murah
- Form warga adalah wizard linear — tidak butuh reaktivitas kompleks
- Target warga desa tidak terbiasa menunggu loading JS bundle

---

## AI Engine — `apps/api/src/ai/`

### Provider abstraksi (wajib diikuti)

Jangan panggil Anthropic SDK atau OpenRouter langsung di luar folder `ai/`.
Semua akses AI harus melalui interface ini:

```typescript
interface AIProvider {
  chat(messages: Message[], opts: ChatOptions): Promise<string>
}

interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}

// Switch via env — tidak perlu ubah logic bisnis
export const ai: AIProvider =
  process.env.AI_PROVIDER === 'openrouter'
    ? new OpenRouterProvider()   // development — model murah/gratis
    : new AnthropicProvider()    // production — direct Anthropic

export const embedder: EmbeddingProvider = new VoyageEmbedder()
```

### Model dan provider

| Kebutuhan | Provider | Model |
|---|---|---|
| Chat warga (cepat) | Anthropic direct (prod) | `claude-haiku-4-5-20251001` |
| Generate surat kompleks | Anthropic direct (prod) | `claude-sonnet-4-6` |
| Intent classifier | Anthropic direct (prod) | `claude-haiku-4-5-20251001` |
| Development | OpenRouter | model murah / free tier |
| Embedding dokumen | **Voyage AI** | `voyage-3-lite` |

Voyage AI dipilih karena:
- Free tier 200 juta token/bulan — lebih dari cukup untuk skala desa
- Endorsed Anthropic sebagai embedding partner resmi
- Tidak perlu Ollama (keterbatasan infrastruktur server)

### RAG Pipeline

```
Admin upload dokumen (PDF / DOCX)
  → pdf-parse / mammoth (ekstrak teks)
  → chunkText() — 500 karakter, 50 karakter overlap
  → Voyage AI embed setiap chunk
  → Simpan ke pgvector dengan desa_id (terisolasi via RLS)

Warga kirim pertanyaan
  → Embed pertanyaan via Voyage AI
  → pgvector similarity search top-5 (filter desa_id otomatis via RLS)
  → Inject 5 chunk ke system prompt Claude
  → Jawaban dikembalikan ke warga
```

Tidak menggunakan LangChain — implementasi manual lebih predictable
dan mudah di-debug untuk skala dokumen desa (~50-200 dok/desa).

---

## Conversation State — `apps/api/src/ai/state/`

Setiap warga punya sesi percakapan tersimpan di Redis:

```typescript
interface ConversationSession {
  sessionId:  string        // hash(desa_id + channel + phone)
  desaId:     string
  phone:      string        // nomor WA atau Telegram user_id
  channel:    'whatsapp' | 'telegram'
  flow:       FlowType
  step:       number        // posisi dalam flow aktif
  data:       Record<string, string>  // data terkumpul selama flow
  history:    Message[]               // max 10 pesan terakhir untuk konteks Claude
  lastAt:     number                  // unix timestamp aktivitas terakhir
}

// Redis key  : session:{desaId}:{channel}:{phone}
// TTL        : 1800 detik (30 menit inaktivitas) → reset ke IDLE
```

### State machine

```
IDLE ──(intent: surat)────→ SURAT    ──(selesai/batal)──→ IDLE
     ──(intent: laporan)──→ LAPORAN  ──(selesai/batal)──→ IDLE
     ──(intent: info)──────→ INFO    ──(selesai)────────→ IDLE
     ──(intent: handoff)───→ HANDOFF ──(petugas selesai)→ IDLE
     ──(confidence < 0.7)──→ KLARIFIKASI ──────────────→ IDLE
```

### Intent classifier

Satu call Claude Haiku, output JSON:

```json
{ "intent": "surat", "confidence": 0.92, "extractedData": { "jenis": "domisili" } }
```

---

## Handoff ke Manusia

### Trigger handoff

- Warga ketik kata kunci: "petugas", "manusia", "tolong", "bingung", "minta bantuan"
- AI gagal menjawab relevan 2x berturut-turut → auto-offer handoff
- Petugas force-take session dari dashboard admin

### Alur handoff

```
1. Session.flow = 'HANDOFF'
2. Ntfy push ke HP petugas yang sedang bertugas:
   "Warga {nama} butuh bantuan
    Topik: {ringkasan singkat dari AI}
    Buka dashboard untuk merespons"
3. Petugas buka dashboard → lihat full chat history
4. Petugas balas dari dashboard → terkirim ke warga via WA/Telegram
5. Semua pesan warga di-bridge ke dashboard, AI tidak merespons
6. Petugas klik tombol "Selesai" → session kembali ke AI IDLE
```

### Tabel petugas

```sql
CREATE TABLE petugas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desa_id     UUID NOT NULL,
  nama        VARCHAR(255) NOT NULL,
  nomor_wa    VARCHAR(20),
  jabatan     VARCHAR(100),   -- bebas, tidak terikat struktur baku
  ntfy_topic  VARCHAR(100),   -- topic Ntfy personal petugas ini
  shift_aktif BOOLEAN DEFAULT true,
  role        VARCHAR(30) NOT NULL DEFAULT 'operator_desa'
);
```

---

## Database & Storage

| Service | Docker Image | Keterangan |
|---|---|---|
| PostgreSQL 16 | `postgres:16-alpine` | Database utama |
| pgvector | ekstensi PostgreSQL | Vector search untuk RAG |
| PgBouncer | `pgbouncer/pgbouncer` | Connection pooling — sudah ada di server |
| Redis 7 | `redis:7-alpine` | Session, cache, BullMQ, rate limit |
| MinIO | `minio/minio` | Foto laporan, PDF surat, lampiran warga |

---

## Multi-Tenant: Shared Database + PostgreSQL RLS

**Pendekatan: satu database, satu aplikasi, satu domain.**

Identifikasi tenant bukan via subdomain tapi via:
- **WhatsApp**: nama instance Evolution API yang menerima pesan
- **Telegram**: bot token yang menerima update
- **Web form**: URL path → `/desa/:slug/form/:jenis`

### Struktur database

```
PostgreSQL (satu instance)
├── Tabel master (tanpa RLS — global)
│   ├── desa        ← daftar semua desa, slug, nomor WA, config
│   ├── paket       ← subscription tier (dibahas nanti)
│   └── audit_log   ← semua mutasi data sensitif untuk akuntabilitas
│
└── Tabel tenant (dengan RLS — otomatis terisolasi per desa)
    ├── warga
    ├── warga_channel
    ├── petugas
    ├── surat
    ├── laporan
    ├── percakapan
    └── document_chunks
```

### PostgreSQL RLS — wajib di semua tabel tenant

```sql
ALTER TABLE warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE warga FORCE ROW LEVEL SECURITY;

CREATE POLICY isolasi_desa ON warga
  USING (desa_id = current_setting('app.desa_id')::uuid);

-- Terapkan pola yang sama ke semua tabel tenant
```

### Prisma middleware auto-inject desa_id

```typescript
// packages/db/src/middleware.ts
export const tenantMiddleware = (desaId: string) => {
  return async (params: MiddlewareParams, next: NextFn) => {
    await prisma.$executeRaw`
      SELECT set_config('app.desa_id', ${desaId}, true)
    `
    if (['create', 'createMany'].includes(params.action)) {
      params.args.data = { ...params.args.data, desa_id: desaId }
    }
    return next(params)
  }
}
```

Onboarding desa baru = insert satu row di tabel `desa`. Langsung aktif.

---

## Autentikasi & Verifikasi Warga

Warga wajib registrasi sebelum menggunakan layanan.
Pairing nomor HP dengan NIK memastikan akurasi data dan keamanan.

### Flow registrasi (sekali seumur hidup)

```
Warga chat pertama kali ke bot WA
  → Bot: "Selamat datang di Jenna AI [Nama Desa].
          Ketik NIK Anda untuk memulai layanan."
  → Warga kirim NIK 16 digit
  → Cek NIK di database
     ├─ Ada (dari import data desa) → lanjut verifikasi OTP
     └─ Belum ada → minta: nama lengkap + tanggal lahir
  → Kirim OTP 6 digit ke nomor WA warga
  → Warga balas OTP
  → Pairing tersimpan di warga_channel
  → Status: TERVERIFIKASI
  → Sesi berikutnya: langsung dikenali tanpa tanya ulang identitas
```

### Schema warga

```sql
CREATE TABLE warga (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desa_id       UUID NOT NULL,
  nik           VARCHAR(16) NOT NULL,
  nama          VARCHAR(255) NOT NULL,
  tanggal_lahir DATE,
  alamat        TEXT,
  wilayah       VARCHAR(100),  -- fleksibel: banjar/RT-RW/dusun/dll
  status        VARCHAR(20) DEFAULT 'belum_verifikasi',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ,
  UNIQUE(desa_id, nik)
);

CREATE TABLE warga_channel (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warga_id    UUID REFERENCES warga(id),
  channel     VARCHAR(20) NOT NULL,  -- 'whatsapp' | 'telegram'
  identifier  VARCHAR(50) NOT NULL,  -- nomor WA atau Telegram user_id
  verified_at TIMESTAMPTZ,
  UNIQUE(channel, identifier)        -- satu nomor = satu warga
);
```

Field `wilayah` sengaja tidak dinamai `banjar` atau `RT/RW` karena
Jenna AI ditargetkan untuk seluruh Indonesia — setiap daerah punya
istilah wilayah administratif terkecil yang berbeda.

### Integrasi data desa existing

Banyak desa sudah punya sistem (SIAK, Siadek, atau custom vendor).
Pendekatan bertahap:

- **Fase 1** (sekarang): Import manual via CSV/Excel dari sistem existing.
  Petugas export → import ke Jenna AI → warga verifikasi via NIK + OTP.
- **Fase 2**: Sync periodik via webhook jika sistem desa mendukung
- **Fase 3**: Integrasi API resmi via MOU dengan Diskominfo daerah

---

## Messaging & Notifikasi

| Channel | Tujuan | Service |
|---|---|---|
| WhatsApp | Percakapan warga ↔ Jenna AI | Evolution API (self-hosted, sudah ada) |
| Telegram | Fallback channel warga | `node-telegram-bot-api` |
| Ntfy | Notif internal petugas saja | `binwiederhier/ntfy` (self-hosted) |

**Pemisahan peran ketat:**
- WA/Telegram → hanya percakapan dengan warga, transaksional murni
- Ntfy → khusus alert internal petugas (laporan masuk, handoff, surat pending TTD)

**Strategi anti-ban WA:**
1. Hanya kirim jika dipicu aksi warga terlebih dulu
2. Maksimal 3 pesan berturut tanpa balasan warga
3. Tidak ada broadcast massal (dinonaktifkan di MVP)
4. Tidak ada pesan promosi atau marketing

### Integrasi Evolution API

```typescript
// Evolution API sudah self-hosted — jangan deploy ulang
const sendWhatsApp = async (phone: string, text: string) => {
  await fetch(
    `${process.env.EVOLUTION_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.EVOLUTION_API_KEY!,
      },
      body: JSON.stringify({
        number: `62${phone.replace(/^0/, '')}`,
        text,
      }),
    }
  )
}

// Webhook receiver: POST /webhook/whatsapp
// Events: messages.upsert, messages.update
// Tenant resolve dari: body.instance → nama instance = slug desa
```

---

## Moderasi Konten

3 lapis — tidak butuh model moderasi eksternal terpisah:

1. **Rate limiting** (Redis, sebelum masuk AI) — blokir abuse lebih awal,
   hemat Claude API quota
2. **Claude system prompt** — instruksikan Jenna hanya menjawab dalam
   konteks pelayanan desa, tolak konten SARA, kasar, tidak relevan
3. **Audit log** — semua pesan dicatat, admin bisa review dan ban nomor
   dari dashboard

---

## Rate Limiting

Implementasi: Redis sliding window.

```
Per nomor WA/Telegram:
  - Max 20 pesan / jam   → key: rl:{channel}:{phone}:hour (expire 3600)
  - Max 60 pesan / hari  → key: rl:{channel}:{phone}:day  (expire 86400)

Per desa (lindungi quota Claude dari satu desa yang abuse):
  - Max 500 pesan / jam  → key: rl:desa:{desaId}:hour (expire 3600)
  - Soft limit: notif ke admin desa via Ntfy
  - Hard limit: queue + delay response

Jika limit tercapai: balas pesan standar, jangan diam.
```

---

## Auth Admin Dashboard

### 3 role (cukup untuk MVP)

| Role | Akses |
|---|---|
| `platform_admin` | Semua desa, audit log global, manage paket. Hanya Malik. |
| `kepala_desa` | Full access desa sendiri: approve surat, manage petugas, setting, statistik |
| `operator_desa` | Operasional harian: proses surat, respons laporan, handle handoff |

Role sengaja tidak granular karena struktur desa tiap daerah Indonesia
berbeda-beda. Kepala desa bisa assign `operator_desa` ke siapa pun.

### Auth method

```
Login  : email + password (bcrypt)
Session: JWT — access token 1 jam, refresh token 7 hari
Reset  : OTP via WA ke nomor terdaftar
MFA    : TOTP opsional untuk platform_admin
```

---

## Infrastruktur & Deploy

### Services yang sudah running di server

| Service | Keterangan |
|---|---|
| Traefik v3 | Jangan ubah konfigurasi global |
| Portainer | Manajemen container |
| PostgreSQL | Tambah ekstensi pgvector |
| PgBouncer | Connection pooling |
| Evolution API | Jangan deploy ulang |
| FRP tunnel | `connect.wibudev.com` aktif |
| Netdata | Monitoring server |

### Container yang perlu ditambahkan

```yaml
services:
  redis:          # image: redis:7-alpine
  minio:          # image: minio/minio
  ntfy:           # image: binwiederhier/ntfy
  dozzle:         # image: amir20/dozzle
  uptime-kuma:    # image: louislam/uptime-kuma
```

### Konvensi Docker Compose (wajib diikuti)

```yaml
services:
  nama-service:
    image: image:tag
    container_name: nama-service
    restart: unless-stopped
    networks:
      - public-net
      - postgres-net
    volumes:
      - /srv/docker/volumes/nama-service:/data
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=public-net"
      - "traefik.http.routers.nama.rule=Host(`subdomain.wibudev.com`)"
      - "traefik.http.routers.nama.entrypoints=websecure"
      - "traefik.http.routers.nama.tls=true"
      - "traefik.http.routers.nama.tls.certresolver=letsencrypt"
      - "traefik.http.services.nama.loadbalancer.server.port=3000"

networks:
  public-net:
    external: true
  postgres-net:
    external: true
```

### CI/CD

GitHub Actions → build Docker image → push ke registry →
Portainer REST API redeploy stack → poll status container →
notif Telegram jika gagal. Ikuti pola stack `desa-plus-stg` yang sudah ada.

---

## Environment Variables

```env
# apps/api/.env

# Database
DATABASE_URL=postgresql://user:pass@pgbouncer:5432/jenna?pgbouncer=true
DIRECT_URL=postgresql://user:pass@postgres:5432/jenna

# Redis
REDIS_URL=redis://redis:6379

# AI Provider
AI_PROVIDER=anthropic             # 'anthropic' | 'openrouter'
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...      # untuk development
CLAUDE_FAST_MODEL=claude-haiku-4-5-20251001
CLAUDE_SMART_MODEL=claude-sonnet-4-6

# Embedding
VOYAGE_API_KEY=...

# Evolution API (sudah ada di server)
EVOLUTION_URL=https://evolution.wibudev.com
EVOLUTION_API_KEY=...

# Telegram
TELEGRAM_BOT_TOKEN=...

# MinIO
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=jenna-ai

# Ntfy
NTFY_URL=https://ntfy.wibudev.com

# JWT
JWT_SECRET=...
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=production
APP_NAME=Jenna AI
```

---

## Konvensi Kode

### Umum

- **Bahasa**: TypeScript strict mode. Tidak ada `any` tanpa komentar alasan
- **Runtime**: Target Bun. Pakai ESM `import`, bukan `require()`
- **Bun API**: Pakai `Bun.file()` bukan `fs.readFile()`, `Bun.serve()`
  bukan `http.createServer()`, dll
- **Environment**: Semua secret via `process.env` — tidak ada hardcode
- **Komentar**: Bahasa Indonesia untuk bisnis logic, Inggris untuk teknis

### Elysia — pattern yang harus diikuti

```typescript
// Controller pakai .group() untuk namespace
const suratController = new Elysia({ prefix: '/surat' })
  .post('/ajukan', async ({ body, desa, db }) => {
    return ajukanSurat(body, desa, db)
  }, {
    body: t.Object({
      nik: t.String({ minLength: 16, maxLength: 16 }),
      jenisSurat: t.Union([
        t.Literal('domisili'),
        t.Literal('skck'),
        t.Literal('keterangan_tidak_mampu'),
        t.Literal('pengantar_bpjs'),
      ]),
      keperluan: t.String({ minLength: 10 }),
    }),
    response: t.Object({
      id: t.String(),
      status: t.String(),
      estimasiSelesai: t.String(),
    }),
  })

// Selalu export type App untuk Eden Treaty
export type App = typeof app
export default app
```

### Prisma — konvensi schema

```prisma
// snake_case untuk field, PascalCase untuk model
// Selalu ada created_at dan updated_at
// UUID untuk semua primary key
// Semua tabel tenant wajib punya desa_id

model Warga {
  id            String    @id @default(uuid())
  desa_id       String
  nik           String
  nama          String
  tanggal_lahir DateTime?
  alamat        String?
  wilayah       String?
  status        String    @default("belum_verifikasi")
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  channels    WargaChannel[]
  surat_list  Surat[]
  laporan     Laporan[]

  @@unique([desa_id, nik])
}
```

---

## Yang Tidak Boleh Dilakukan

- Jangan pakai Zod — validasi pakai Elysia `t` (TypeBox)
- Jangan deploy container WhatsApp baru — Evolution API sudah ada
- Jangan ubah konfigurasi Traefik global di server
- Jangan gunakan `any` di TypeScript tanpa komentar alasan
- Jangan hardcode credential — selalu `process.env`
- Jangan pakai `node:` built-in jika ada Bun API yang setara
- Jangan buat endpoint tanpa response type di Elysia schema
- Jangan query tabel tenant tanpa `tenantMiddleware` aktif
- Jangan pakai LangChain — RAG diimplementasi manual
- Jangan kirim pesan WA tanpa dipicu aksi warga terlebih dulu (anti-ban)
- Jangan hardcode istilah wilayah spesifik daerah (`banjar`, `RT/RW`, dll)
  — gunakan field `wilayah` yang generik untuk seluruh Indonesia
- Jangan akses AI provider langsung — selalu lewat abstraksi di `src/ai/`

---

## Referensi

- Elysia: https://elysiajs.com
- Eden Treaty: https://elysiajs.com/eden/treaty/overview
- Bun React: https://bun.com/docs/guides/ecosystem/react
- Bun + Elysia: https://bun.com/docs/guides/ecosystem/elysia
- Claude API: https://docs.anthropic.com
- Voyage AI: https://docs.voyageai.com
- Evolution API: https://doc.evolution-api.com
- OpenRouter: https://openrouter.ai/docs
- Prisma + Bun: https://bun.com/docs/guides/ecosystem/prisma
- Turborepo: https://turbo.build/repo/docs
- HTMX: https://htmx.org/docs
- pgvector: https://github.com/pgvector/pgvector

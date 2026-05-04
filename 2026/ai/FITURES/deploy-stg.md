# MCP Deploy Server — Pola Umum

Panduan agnostik untuk membangun MCP server deploy otomatis di project
apa pun. Tidak terikat stack tertentu — bisa Docker, VPS, serverless,
atau platform lain.

---

## `.mcp.json` — Apa & Bagaimana

### Apa itu `.mcp.json`?

File konfigurasi di root project yang mendaftarkan **MCP (Model Context
Protocol) server**. Claude Code membaca file ini saat startup dan
me-register semua server — sehingga tool-tool yang disediakan server
muncul di sesi dengan prefix namespace.

Satu file bisa mendaftarkan banyak server sekaligus. Tidak ada batasan
jumlah server maupun jumlah tool per server.

### Format

```json
{
  "mcpServers": {
    "<nama-server>": {
      "command": "<runtime>",
      "args": ["<entry-point>"],
      "env": { "KEY": "value" },
      "description": "..."
    }
  }
}
```

### Dua jenis transport

| Jenis     | Key                    | Cara kerja                                                      | Cocok untuk                              |
| --------- | ---------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| **stdio** | `command` + `args`     | Claude Code spawn process, komunikasi via stdin/stdout JSON-RPC | Tool lokal (git, file system, CLI)       |
| **HTTP**  | `type: "http"` + `url` | Claude Code HTTP POST ke endpoint, Bearer auth opsional         | Tool remote (API staging, DB production) |

```json
// Contoh: stdio server (process lokal)
{
  "deploy-stg": {
    "command": "bun",
    "args": ["run", "scripts/mcp/deploy.ts"],
    "env": {
      "STACK_NAME": "my-app",
      "BASE_URL": "https://my-app.example.com",
      "ENV": "stg",
      "GH_TOKEN": "${GH_TOKEN}",
      "GH_REPO": "owner/repo"
    },
    "description": "Deploy pipeline ke staging"
  }
}

// Contoh: HTTP server (remote)
{
  "staging-api": {
    "type": "http",
    "url": "https://staging.example.com/mcp",
    "headers": { "Authorization": "Bearer ${AUTH_TOKEN}" }
  }
}
```

### Cara Claude Code membaca `.mcp.json`

1. Saat sesi dimulai di direktori project, Claude Code mencari `.mcp.json` di root
2. Setiap server stdio di-spawn sebagai child process
3. Komunikasi dua arah via **JSON-RPC 2.0** (request → response)
4. Server HTTP dipanggil via HTTP POST dengan body JSON-RPC
5. Semua tool dari semua server muncul di sesi dengan prefix namespace:
   - `mcp__<nama-server>__<nama-tool>`
   - Contoh: `mcp__deploy-stg__deploy`, `mcp__my-app__check_version`

### Environment variable interpolation

Nilai `${VAR}` di `.mcp.json` di-interpolasi dari environment variable
Claude Code session. Berguna untuk menyuntikkan token/auth tanpa hardcode.

```json
"env": {
  "AUTH_TOKEN": "${AUTH_TOKEN}"
}
```

> **Catatan**: `.mcp.json` hanya berisi deklarasi server — bukan
> environment variable project. Variable sensitif tetap disimpan di
> `.env` dan di-passing oleh Claude Code ke child process.

> **Commit atau ignore?** `.mcp.json` **harus di-commit** ke repo.
> File ini adalah konfigurasi tooling project (seperti `.eslintrc`,
> `tsconfig.json`) — bukan secret. Dengan men-commit-nya, semua
> contributor langsung punya MCP server yang sama saat clone.
> Yang perlu di-ignore hanya file yang mengandung credential atau
> bersifat lokal murni (`.env`, `*.pem`, output build).

### Konfigurasi per-project via env

Daripada hardcode konstanta di script, baca dari `process.env` dengan
fallback. Pola ini membuat **satu script bisa dipakai di banyak project**
hanya dengan beda konfigurasi di `.mcp.json`.

```typescript
// ❌ Hardcode — tidak bisa dikonfigurasi ulang
const STACK_NAME = "my-app";
const STACK_ENV = "stg";
const STAGING_URL = "https://my-app.example.com";

// ✅ Env-driven dengan fallback
const STACK_NAME = process.env.STACK_NAME ?? "my-app";
const STACK_ENV = process.env.ENV ?? "stg";
const STAGING_URL = process.env.BASE_URL ?? "https://my-app.example.com";
```

Lima var standar untuk deploy server:

| Env Var      | Keterangan                                        | Contoh                                |
| ------------ | ------------------------------------------------- | ------------------------------------- |
| `STACK_NAME` | Nama stack di Portainer / nama service / app name | `my-app`                              |
| `BASE_URL`   | URL target untuk verifikasi versi live            | `https://my-app.example.com`          |
| `ENV`        | Environment label (`stg`, `prod`, `preview`)      | `stg`                                 |
| `GH_TOKEN`   | GitHub PAT / token untuk `gh` CLI dan `git push`  | nilai dari environment host           |
| `GH_REPO`    | `owner/repo` GitHub untuk trigger workflow        | `owner/repo`                          |

`GH_TOKEN` wajib untuk operasi tulis GitHub (`git push`, `gh workflow run`).
Tanpa token, server hanya bisa melakukan operasi baca (scan, check version).
Token di-passing dari environment host ke child process MCP via `${GH_TOKEN}`
interpolation di `.mcp.json` — **tidak pernah di-hardcode di file**.

`GH_REPO` bersifat opsional — jika tidak diset, server membaca otomatis
dari `git remote get-url origin`. Berguna saat nama repo di `.mcp.json`
berbeda dari remote aktual (mis. fork, rename):

```typescript
const REPO =
  process.env.GH_REPO ??
  (() => {
    try {
      const url = execSync("git remote get-url origin", {
        encoding: "utf8",
      }).trim();
      const m = url.match(/github\.com[/:](.+?\/.+?)(?:\.git)?$/);
      if (m) return m[1];
    } catch {}
    return "owner/repo"; // fallback — ganti dengan default project kamu
  })();
```

Fallback values di script memastikan server tetap berjalan meski `env`
di `.mcp.json` tidak lengkap — misalnya saat development lokal tanpa
file `.mcp.json`.

---

## Arsitektur MCP Deploy Server

### Prinsip desain

```
┌──────────────────────────────────────────────────┐
│  Claude Code Session                             │
│                                                  │
│  User: "deploy ke staging"                       │
│       │                                          │
│       ▼                                          │
│  Claude memutuskan tool call:                    │
│  mcp__<nama-server>__deploy({ bump: "patch" })   │
│       │                                          │
│       ▼                                          │
│  JSON-RPC Request → stdin                        │
│       │                                          │
│       ▼                                          │
│  ┌────────────────────────────────┐              │
│  │  MCP Server (process lokal)    │              │
│  │                                │              │
│  │  Runtime: Bun / Node / Python  │              │
│  │  SDK: @modelcontextprotocol   │              │
│  │  Transport: StdioServer        │              │
│  │                                │              │
│  │  Tools:                        │              │
│  │  ├── deploy                    │              │
│  │  ├── check_version             │              │
│  │  ├── deploy_status             │              │
│  │  └── preflight                 │              │
│  │                                │              │
│  │  Dependensi eksternal:         │              │
│  │  ├── git (branch, diff, push)  │              │
│  │  ├── gh CLI (workflow trigger) │              │
│  │  ├── Tool stack (migrasi, dll) │              │
│  │  └── HTTP ke staging (verify)  │              │
│  └────────────────────────────────┘              │
│       │                                          │
│       ▼                                          │
│  JSON-RPC Response ← stdout                      │
│       │                                          │
│       ▼                                          │
│  Claude menampilkan hasil ke user                │
└──────────────────────────────────────────────────┘
```

### Mengapa MCP server terpisah, bukan skill?

| Aspek        | MCP Server (stdio)                                | Skill (Markdown prompt)                       |
| ------------ | ------------------------------------------------- | --------------------------------------------- |
| Eksekusi     | Kode nyata — akses file system, network, CLI      | Hanya instruksi teks ke Claude                |
| Kecepatan    | Deterministik, instant                            | Bergantung pada Claude membaca + mengeksekusi |
| Kompleksitas | Bisa kompleks (loop, retry, parse)                | Terbatas pada yang Claude bisa lakukan        |
| Output       | JSON terstruktur                                  | Teks bebas                                    |
| Reusabilitas | Framework-agnostic, bisa dipanggil dari mana saja | Hanya di sesi Claude                          |

**Rule of thumb**: jika pipeline melibatkan polling, retry, timeout,
parsing output CLI, atau akses sistem yang presisi → **MCP server**.
Jika hanya instruksi naratif ke Claude → **skill**.

### Server harus standalone

MCP server stdio TIDAK boleh mengimpor dari kode project. Alasannya:

- Server di-spawn sebagai process terpisah — import dari `src/` bisa
  menarik dependensi besar dan lambat startup
- Server harus berjalan bahkan saat project dalam state broken (gagal
  build, missing dependency)
- Isolasi mencegah side-effect (koneksi DB terbuka, log file terkunci)

Server hanya boleh bergantung pada: SDK MCP itu sendiri, runtime
standard library, dan CLI tools eksternal (`git`, `gh`, `docker`, dll).

---

## Pola Pipeline: Preflight → Mutate → Push → Deploy → Verify

### Flow umum

```
START
  │
  ▼
┌─────────────────────┐
│ 1. Pre-checks       │
│  ├─ Branch target   │  harus di branch yang benar
│  └─ Working tree    │  harus clean
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Preflight scan   │  ← JALANKAN SEBELUM mutasi apapun
│  ├─ Credential leak │  BLOCK jika terdeteksi
│  └─ Migration check │  BLOCK jika drift (optional)
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Version bump     │  patch | minor | major
│    (package.json)   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Git commit       │  chore: bump X.X.X
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 5. Git push         │  origin/<branch>
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 6. Trigger deploy   │  CI/CD, Docker, script remote
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 7. Wait + verify    │  Poll sampai versi target live
└──────────┬──────────┘
           ▼
         DONE
```

### Prinsip kunci: preflight sebelum mutasi

Preflight (credential scan, migration check) harus dijalankan **SEBELUM**
version bump dan commit. Alasannya:

```
❌ SALAH: bump → commit → scan → BLOCKED
   └─ commit version bump sudah ada, harus di-undo

✅ BENAR: scan → BLOCKED? stop → baru bump → commit
   └─ tidak ada yang perlu di-undo, user tinggal perbaiki
```

Commit version bump yang gagal deploy menyisakan noise di history dan
harus di-reset manual. Dengan preflight di depan, pipeline berhenti
sebelum menyentuh file apapun.

---

## Empat Tool Standar

Setiap MCP deploy server sebaiknya menyediakan minimal 4 tool ini:

### 1. `deploy` — Deploy penuh

Pipeline end-to-end. Menerima parameter bump type dan opsional skip.

```typescript
// Input schema
{
  bump: "patch" | "minor" | "major",  // default: patch
  message: string,                     // opsional, auto-generate
  skip_commit: boolean                 // skip bump+commit
}

// Output sukses
{
  success: true,
  version: "1.2.3",
  target_url: "https://staging.example.com",
  steps: [
    { step: "credential_scan", status: "ok" },
    { step: "migration_check", status: "ok" },
    { step: "bump_version", status: "ok", detail: "1.2.2 → 1.2.3" },
    { step: "commit", status: "ok" },
    { step: "push", status: "ok" },
    { step: "deploy_triggered", status: "ok" },
    { step: "deploy_done", status: "ok" },
    { step: "verify", status: "ok", detail: "https://... → 1.2.3" }
  ]
}

// Output blocked
{
  success: false,
  blocked_by: "credential_leak" | "migration_missing",
  issues: [...],
  steps: [...],
  hint: "Instruksi perbaikan sebelum deploy ulang"
}
```

### 2. `check_version` — Bandingkan versi lokal vs target

```json
// Output
{
  "local": "1.2.3",
  "target": "1.2.2",
  "target_url": "https://staging.example.com",
  "target_error": null,
  "in_sync": false
}
```

### 3. `deploy_status` — Cek status CI/CD terakhir

```json
// Output
{
  "workflows": [
    {
      "id": 123,
      "name": "deploy",
      "status": "completed",
      "conclusion": "success"
    }
  ]
}
```

### 4. `preflight` — Scan tanpa deploy

```json
// Output
{
  "credential_scan": { "ok": true, "issues": [] },
  "migration_check": { "ok": true, "warnings": [] },
  "deploy_safe": true
}
```

---

## Credential Scan — Pola Agnostik

Scan berjalan otomatis di step **preflight** sebelum version bump. Pipeline
berhenti (`blocked_by: "credential_leak"` atau `"sensitive_file"`) jika ada
temuan — tidak ada commit yang dibuat.

### Pattern regex (diimplementasikan di `scripts/mcp/deploy.ts`)

| Nama pattern          | Regex (ringkas)                                        | Kategori                      |
| --------------------- | ------------------------------------------------------ | ----------------------------- |
| `anthropic_key`       | `sk-ant-[a-zA-Z0-9\-_]{20,}`                           | Anthropic API key             |
| `openai_key`          | `sk-[a-zA-Z0-9]{48}`                                   | OpenAI API key                |
| `stripe_key`          | `sk_(live\|test)_[a-zA-Z0-9]{24,}`                     | Stripe secret key             |
| `github_pat`          | `ghp_[a-zA-Z0-9]{36,}`                                 | GitHub PAT (classic)          |
| `github_oauth`        | `gho_[a-zA-Z0-9]{36,}`                                 | GitHub OAuth token            |
| `github_fine_grained` | `github_pat_[a-zA-Z0-9_]{22,}`                         | GitHub fine-grained PAT       |
| `slack_token`         | `xox[baprs]-[a-zA-Z0-9\-]{20,}`                        | Slack token                   |
| `google_api_key`      | `AIza[a-zA-Z0-9\-_]{35}`                               | Google API key                |
| `google_oauth_token`  | `ya29\.[a-zA-Z0-9\-_]{20,}`                            | Google OAuth access token     |
| `private_key_pem`     | `-----BEGIN [A-Z ]+ PRIVATE KEY-----`                  | PEM private key               |
| `bearer_hardcoded`    | `Bearer\s+[a-zA-Z0-9\-_\.]{20,}`                       | Bearer token di kode          |
| `db_url_with_creds`   | `(postgres\|mysql\|mongodb\|redis)://user:pass@`       | Database URL with credentials |
| `hardcoded_secret`    | `(password\|secret\|token)\s*[:=]\s*["'][^"']{8,}["']` | Credential hardcode           |

### File sensitif (diblok jika masuk diff)

| Pattern                            | Alasan                    |
| ---------------------------------- | ------------------------- |
| `.env`, `.env.*`                   | Environment variable      |
| `*.pem`, `*.key`, `*.p12`, `*.pfx` | Private key / certificate |
| `credentials.json`, `*.yaml`       | Credential file           |
| `service-account.json`             | GCP / AWS service account |
| `id_rsa`, `id_ed25519`             | SSH private key           |

### Cara scan

**Diff scan** — hanya baris baru (`+`), bukan seluruh codebase:

```bash
git diff origin/stg..HEAD -- . ":(exclude)*.lock" ":(exclude)package-lock.json" \
  | grep '^+' | grep -v '^+++'
```

**File scan** — cek nama file yang berubah di diff:

```bash
git diff --name-only origin/stg..HEAD
# → filter basename dengan regex SENSITIVE_FILE_PATTERNS
```

### Output saat blocked

```json
{
  "success": false,
  "blocked_by": "credential_leak",
  "hint": "Perbaiki credential leak sebelum deploy: anthropic_key, github_pat",
  "steps": [
    {
      "step": "preflight",
      "status": "blocked",
      "issues": [
        { "type": "anthropic_key", "sample": "sk-ant-api03-abc***", "count": 1 }
      ],
      "detail": "Credential leak: anthropic_key"
    }
  ]
}
```

Tiga nilai `blocked_by`: `dirty_tree`, `credential_leak`, `sensitive_file`.
Masing-masing punya `hint` berbeda yang actionable.

### Redaksi output

Nilai credential yang terdeteksi di-redact — hanya 20 karakter pertama + `***`:

```
✅ Benar: { type: "anthropic_key", sample: "sk-ant-api03-abc***", count: 1 }
❌ Salah: { type: "anthropic_key", sample: "sk-ant-api03-<full-key-leaked>" }
```

---

## Migration / Schema Check — Pola Adaptif

Cek ini spesifik terhadap ORM/tool yang dipakai. Di bawah adalah
pola generik yang bisa diadaptasi.

### Pola umum untuk ORM apapun

```
1. Deteksi perubahan schema file
   → git diff origin/<branch>..HEAD -- <schema-file>

2. Deteksi file migrasi baru
   → git diff origin/<branch>..HEAD --name-only -- <migrations-dir>

3. Jika schema berubah tapi tidak ada migrasi → BLOCK
   → "Schema changed without migration"

4. Jika ada migrasi baru → WARNING (informatif)

5. Cek migrasi unstaged → WARNING
   → git ls-files --others --exclude-standard <migrations-dir>

6. Cek drift (schema vs applied migrations) → WARNING
   → <orm-cli> migrate diff
```

### Adaptasi per ORM

| ORM/Tool | Schema file                     | Migration dir         | Drift check CLI                 |
| -------- | ------------------------------- | --------------------- | ------------------------------- |
| Prisma   | `prisma/schema.prisma`          | `prisma/migrations/`  | `prisma migrate diff`           |
| Drizzle  | `drizzle/schema.ts`             | `drizzle/migrations/` | `drizzle-kit check`             |
| Knex     | `knexfile.ts` + migration files | `migrations/`         | Manual (bandingkan hash)        |
| TypeORM  | `src/entities/*.ts`             | `src/migrations/`     | `typeorm migration:generate`    |
| Alembic  | `models/*.py`                   | `alembic/versions/`   | `alembic check`                 |
| Goose    | N/A (SQL-first)                 | `migrations/`         | N/A (SQL-first, no schema file) |
| Atlas    | `schema.sql` + `atlas.hcl`      | `migrations/`         | `atlas migrate diff`            |

### SQL-first vs Code-first

```
SQL-first (Goose, Atlas, raw SQL):
  └─ Migration check: cukup cek apakah file .sql baru ada di diff
     └─ Tidak ada "schema file" yang bisa di-drift-check

Code-first (Prisma, Drizzle, TypeORM):
  └─ Migration check: cek schema file + migration dir + drift
     └─ Drift = schema file berbeda dari apa yang ada di migration
```

Jika project kamu **SQL-first**, cukup cek langkah 2-5 saja.

---

## Deploy Target — Pola Adaptif

Pipeline deploy tidak harus Docker + GitHub Actions. Berikut adaptasi
untuk berbagai target:

### Docker + GitHub Actions (pola referensi)

```bash
# Auth: set GH_TOKEN di environment, gh CLI otomatis membacanya
export GH_TOKEN=<your-github-pat>

# Git push pakai token (tanpa perlu gh auth login)
git push https://oauth2:${GH_TOKEN}@github.com/<owner>/<repo>.git <branch>

# Trigger build
gh workflow run publish.yml --ref <branch> -f stack_env=stg

# Trigger deploy
gh workflow run re-pull.yml --ref <branch> -f stack_env=stg -f stack_name=<name>

# Poll status
while true; do
  status=$(gh run view <run_id> --json status,conclusion)
  if [ "$status" = "completed" ]; then break; fi
  sleep 5
done
```

> **Kenapa tidak pakai `gh auth login`?** `gh auth login` butuh browser (device flow),
> tidak cocok untuk MCP server yang berjalan di background tanpa terminal interaktif.
> `GH_TOKEN` + push URL token-based menghilangkan ketergantungan pada interactive auth.

### Docker + SSH (VPS manual)

```bash
# Build & push image
docker build -t <registry>/<app>:<version> .
docker push <registry>/<app>:<version>

# Deploy via SSH
ssh <host> "docker pull <registry>/<app>:<version> && docker compose up -d"
```

### VPS langsung (no Docker)

```bash
# Push ke Git remote khusus (git push production)
git remote add production ssh://<host>/path/to/repo
git push production <branch>

# Atau rsync + restart
rsync -avz --exclude node_modules ./ <host>:/path/to/app
ssh <host> "cd /path/to/app && npm install && pm2 restart app"
```

### Platform as a Service (Vercel, Railway, Fly.io)

```bash
# Trigger deploy via CLI
vercel deploy --prod
railway up
flyctl deploy
```

### Serverless / Edge (Cloudflare Workers, AWS Lambda)

```bash
wrangler deploy
serverless deploy
```

### Pola verifikasi umum

```typescript
async function verifyVersion(
  expected: string,
  url: string,
  timeoutMs = 120_000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/api/version`);
      const { version } = await res.json();
      if (version === expected) return true;
    } catch {
      /* retry */
    }
    await sleep(5_000);
  }
  return false;
}
```

---

## Timeout & Retry

| Tahap          | Timeout rekomendasi | Interval | Alasan                             |
| -------------- | ------------------- | -------- | ---------------------------------- |
| Build image    | 300-600s            | 5-10s    | Docker build bisa 3-10 menit       |
| Deploy/restart | 120-300s            | 5s       | Pull + container start             |
| Verify version | 120-180s            | 5s       | Tunggu app sehat + health check OK |
| Health check   | 60s                 | 2s       | Jika ada endpoint `/health`        |

Sesuaikan timeout dengan karakteristik stack kamu. Build Go/Rust
jauh lebih cepat dari Docker multi-stage Node.js.

---

## Checkpoint Commit — Opsional tapi Direkomendasikan

Sebelum memulai deploy, buat commit checkpoint untuk menyelamatkan
semua perubahan yang belum di-commit:

```bash
git add -A && git commit -m "checkpoint: sebelum deploy v${version}" || true
```

Ini mencegah kehilangan work-in-progress jika deploy gagal dan perlu
rollback. Commit checkpoint bisa di-squash nanti.

---

## Keamanan

- **Environment variable, bukan hardcode** — semua token/secret dari `process.env`
- **Redact credential di output** — jangan tampilkan nilai penuh
- **Scan diff, bukan seluruh codebase** — lebih cepat dan minim false positive
- **Preflight sebelum mutasi** — tidak meninggalkan artifact setengah jalan
- **Server standalone** — tidak import dari `src/`, tidak ada side-effect
- **Jangan log credential** — gunakan `console.error` untuk log internal,
  bedakan dari `stdout` yang digunakan JSON-RPC
- **GH_TOKEN via `.mcp.json` interpolation** — token di-passing dari host env
  ke child process via `${GH_TOKEN}`, tidak pernah ditulis ke file. `git push`
  menggunakan URL embedded `https://oauth2:<token>@github.com/...` — token
  hanya muncul di memory process, tidak di log atau config file

### Pattern anti-leak tambahan

```bash
# Cek apakah .env ada di .gitignore sebelum push
grep -q '\.env' .gitignore || echo "WARNING: .env tidak di .gitignore"

# Scan unstaged files juga
git ls-files --others | grep -E '\.(env|pem|key|p12)$'
```

---

## Checklist Implementasi

Saat membangun MCP deploy server untuk project baru, jawab pertanyaan ini:

- [ ] Runtime apa? (Bun, Node, Python, Go)
- [ ] Branch target deploy? (`stg`, `main`, `production`)
- [ ] Version bump: semver atau timestamp?
- [ ] ORM apa? Code-first atau SQL-first?
- [ ] Di mana schema file dan migration dir?
- [ ] Deploy target: Docker + GHA, SSH, PaaS, serverless?
- [ ] Bagaimana cara trigger deploy? (CLI command, API call)
- [ ] Bagaimana cara cek status deploy? (poll workflow, cek container)
- [ ] Endpoint verifikasi? (`/api/version`, `/health`)
- [ ] Token/auth apa yang dibutuhkan untuk akses staging/production?
- [ ] GH_TOKEN: sudah di-set di environment host? Sudah di-passing via `.mcp.json` `"${GH_TOKEN}"`?

# Better Auth + Google OAuth — Pola Umum

Panduan agnostik untuk membangun sistem autentikasi dengan Better Auth,
Google OAuth, RBAC, tenant middleware, dan dev-auth bypass. Bisa
diterapkan ke project apa pun — tidak terikat stack, framework, atau
domain bisnis tertentu.

---

## Pilihan Teknologi

### Kenapa Better Auth?

| Aspek | Better Auth | NextAuth / Auth.js | Lucia | Clerk |
|---|---|---|---|---|
| Framework coupling | Tidak ada (universal) | Terikat Next.js | Tidak ada | SaaS eksternal |
| Database adapter | Prisma, Drizzle, Kysely | Prisma, Drizzle | Prisma, Drizzle | N/A (managed) |
| Social provider | Google, GitHub, Apple, dll | Banyak (80+) | Manual | Banyak |
| RBAC bawaan | Tidak (custom) | Tidak | Tidak | Ya (terbatas) |
| Self-hosted | Ya | Ya | Ya | Tidak |
| Custom user fields | Ya (additionalFields) | Tidak (harus extend) | Ya (attributes) | N/A |
| Session cache control | Ya (cookieCache toggle) | Terbatas | N/A | N/A |
| TypeScript | First-class | OK | OK | OK |

Better Auth dipilih karena **tidak terikat framework**, mendukung
**custom fields di user**, dan memberikan kontrol penuh atas session
(`cookieCache: false` untuk validasi DB setiap request).

### Kenapa Google OAuth saja (bukan email/password)?

- **Nol manajemen password** — tidak perlu reset password, hash, breach detection
- **Verifikasi email bawaan** — Google sudah memverifikasi email
- **Security** — tidak ada credential stuffing, brute force, atau weak password
- **Onboarding minimal** — user cukup klik, tidak isi form
- **Trade-off**: user harus punya akun Google. Jika target user tidak
  semuanya punya Google, tambahkan GitHub OAuth atau email/password

---

## Arsitektur Auth — Pola Universal

```
┌──────────────────────────────────────────────────────────────┐
│                     Aplikasi                                 │
│                                                              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  │
│  │  Better Auth            │  │  Auth Sekunder (opsional) │  │
│  │  (admin/user internal)  │  │  (end-user/customer)     │  │
│  │                         │  │                          │  │
│  │  Auth: Social OAuth     │  │  Auth: OTP / Magic Link  │  │
│  │  Session: cookie        │  │  Session: JWT cookie     │  │
│  │  Tabel: User            │  │  Tabel: EndUser          │  │
│  │                         │  │                          │  │
│  │  Middleware stack:      │  │  Middleware:             │  │
│  │  ├─ authMiddleware      │  │  └─ requireEndUser       │  │
│  │  ├─ requireAuth         │  │                          │  │
│  │  ├─ requireRole(level)  │  │                          │  │
│  │  └─ tenantMiddleware    │  │                          │  │
│  └─────────────────────────┘  └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Publik (tanpa auth)                                  │   │
│  │  Endpoint yang bisa diakses siapa saja                │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Dua sistem auth terpisah** adalah pola umum ketika satu aplikasi
melayani dua jenis user yang sangat berbeda (internal admin vs
end-user/customer). Jangan paksakan keduanya dalam satu sistem —
biaya kompleksitasnya lebih besar dari duplikasi.

---

## Better Auth — Setup Agnostik

### Instalasi & konfigurasi minimal

```typescript
// auth.ts — file tunggal untuk instance Better Auth
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './db'

export const auth = betterAuth({
  // 1. Database adapter — Prisma, Drizzle, atau Kysely
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  // 2. Email/password — aktifkan hanya jika butuh
  emailAndPassword: {
    enabled: true,       // true meski tidak dipakai di UI
    autoSignIn: true,    // auto login setelah register
  },

  // 3. Social provider — minimal Google
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // 4. Session — sesuaikan dengan kebutuhan keamanan
  session: {
    cookieCache: {
      enabled: false,  // false = validasi DB tiap request (lebih aman)
    },
  },

  // 5. Custom fields — tambahan di tabel user
  user: {
    additionalFields: {
      role:    { type: 'string',  default: 'user',  input: false },
      status:  { type: 'string',  default: 'pending', input: false },
    },
  },

  // 6. Database hooks — side-effect saat event lifecycle
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-promote admin, kirim welcome email, dll
        },
      },
    },
  },
})
```

### Mount ke framework HTTP

Better Auth adalah **framework-agnostic**. Method `auth.handler(request)`
menerima standard `Request` object — bisa di-mount ke framework apa pun.

```typescript
// Elysia (Bun)
new Elysia()
  .all('/api/auth/*', async ({ request }) => auth.handler(request))

// Express
app.all('/api/auth/*', (req, res) => {
  // konversi req ke Request standard
})

// Hono (Cloudflare Workers)
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

// Fastify
fastify.all('/api/auth/*', async (request, reply) => {
  // konversi request ke Request standard
})
```

> **Prinsip**: Better Auth menangani SEMUA di bawah `/api/auth/*` —
> sign-in, sign-up, callback, session. Route aplikasi lain TIDAK
> boleh tumpang tindih dengan prefix ini.

### Environment variables minimum

```bash
BETTER_AUTH_SECRET=xxx        # Secret signing session cookie
BETTER_AUTH_URL=http://lokal  # Base URL untuk OAuth callback
GOOGLE_CLIENT_ID=xxx          # Google OAuth client ID
GOOGLE_CLIENT_SECRET=xxx      # Google OAuth client secret
ADMIN_EMAILS=a@b.com,c@d.com  # Email yang auto-promote ke admin
```

### Google Cloud Console setup

1. Buat project di [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → OAuth consent screen → isi nama app + email
3. Credentials → Create OAuth client ID → Web application
4. Authorized redirect URIs: `{BETTER_AUTH_URL}/api/auth/callback/google`
5. Simpan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`

---

## Google OAuth — Alur Universal

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Browser │     │  Frontend    │     │  Better Auth │     │  Google  │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘
     │                  │                    │                  │
     │  Klik "Login"    │                    │                  │
     │─────────────────►│                    │                  │
     │                  │                    │                  │
     │                  │  POST /api/auth/   │                  │
     │                  │  sign-in/social    │                  │
     │                  │  { provider,       │                  │
     │                  │    callbackURL }   │                  │
     │                  │───────────────────►│                  │
     │                  │                    │                  │
     │                  │  { url: "https://  │                  │
     │                  │   accounts.google  │                  │
     │                  │   .com/o/oauth2/" }│                  │
     │                  │◄───────────────────│                  │
     │                  │                    │                  │
     │                  │ window.location = url                 │
     │                  │──────────────────────────────────────►│
     │                  │                    │                  │
     │                  │                    │  OAuth consent   │
     │                  │                    │◄─────────────────│
     │                  │                    │                  │
     │                  │                    │  Auth code       │
     │                  │  GET /api/auth/    │◄─────────────────│
     │                  │  callback/google   │                  │
     │                  │◄───────────────────│                  │
     │                  │                    │                  │
     │                  │  Tukar code → token│                  │
     │                  │  Ambil user info   │                  │
     │                  │  Create/find user  │                  │
     │                  │  (auto-promote)    │                  │
     │                  │  Buat session      │                  │
     │                  │  Set cookie        │                  │
     │                  │                    │                  │
     │                  │  Redirect ke       │                  │
     │                  │  callbackURL       │                  │
     │                  │◄───────────────────│                  │
     │                  │                    │                  │
     │  GET /login      │                    │                  │
     │  (dengan cookie) │                    │                  │
     │─────────────────►│                    │                  │
     │                  │                    │                  │
     │                  │  Cek role + status │                  │
     │                  │  Redirect sesuai   │                  │
     │  ◄────────────────│                    │                  │
```

### Redirect decision after login (pola umum)

```
GET halaman-login (sudah ada session cookie)
  │
  ▼
GET /api/users/me (cek session + profil)
  │
  ├─ role = admin, status = active ──► /admin
  ├─ role = staff, status = active ──► /dashboard
  ├─ role = user,  status = pending ──► /onboarding
  └─ lainnya ──► /pending (parkir)
```

---

## Model User — Pola yang Bisa Di-extend

### Schema minimum

```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?

  // Custom fields — sesuaikan dengan domain kamu
  role          String    @default("user")      // user, admin, moderator
  status        String    @default("pending")   // pending, active, suspended

  // Relasi Better Auth standard
  sessions      Session[]
  accounts      Account[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Field yang WAJIB ada (Better Auth requirement)

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | String UUID | Primary key |
| `name` | String | Nama user |
| `email` | String (unique) | Email (unique constraint) |
| `emailVerified` | Boolean | Better Auth set ini |
| `image` | String? | Foto profil |
| `sessions` | Session[] | Relasi ke tabel session |
| `accounts` | Account[] | Relasi ke tabel account |

### Custom fields — sesuaikan dengan bisnis

Better Auth mendukung `additionalFields` untuk menyimpan data tambahan
di tabel user. Field ini dikirim ke session dan bisa diakses di middleware.

```typescript
user: {
  additionalFields: {
    // Contoh custom fields
    role:        { type: 'string',  default: 'user',     input: false },
    status:      { type: 'string',  default: 'pending',  input: false },
    tenantId:    { type: 'string',  default: '',          input: false },
    permissions: { type: 'string',  default: '[]',        input: false },
    isReviewer:  { type: 'boolean', default: false,       input: false },
  }
}
```

> **Catatan**: Better Auth tidak mendukung tipe JSON native. Simpan
> array/objek sebagai string JSON lalu parse di aplikasi.

### Session & Account schema (standard Better Auth)

```prisma
model Session {
  id        String   @id @uuid
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                    String   @id @uuid
  accountId             String
  providerId            String
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Verification {
  id         String   @id @uuid
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## Role & RBAC — Pola Hierarki

### Definisi role hierarchy

```typescript
// lib/types/auth.ts
export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 5,
  admin:       4,
  manager:     3,
  editor:      2,
  viewer:      1,
}

export type Role = keyof typeof ROLE_HIERARCHY

export function hasMinRole(userRole: string, minRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0
  const minLevel = ROLE_HIERARCHY[minRole] ?? 0
  return userLevel >= minLevel
}
```

### Status lifecycle

```
User baru ──► pending ──► active ──► (bisa akses)
                 │           │
                 ├──► rejected
                 └──► suspended
```

### Pattern: `requireRole()` middleware factory

```typescript
// middleware/rbac.ts
function requireRole(minRole: string) {
  return new Elysia()
    .derive(async ({ request }) => {
      // 1. Ambil session dari Better Auth
      const session = await auth.api.getSession({
        headers: request.headers
      })

      if (!session) throw new Error('Unauthorized')

      const user = session.user as AuthUser

      // 2. Hitung effective level
      const userLevel = ROLE_HIERARCHY[user.role] ?? 0
      const minLevel = ROLE_HIERARCHY[minRole] ?? 0

      // 3. Optional: flag spesial (reviewer, auditor)
      const effectiveLevel = user.isReviewer
        ? Math.max(userLevel, ROLE_HIERARCHY.reviewer ?? 0)
        : userLevel

      if (effectiveLevel < minLevel) {
        throw new Error(`Forbidden: minimal role ${minRole}`)
      }

      // 4. Cek status (skip untuk admin)
      if (user.role !== 'super_admin' && user.status !== 'active') {
        throw new Error('Forbidden: user tidak aktif')
      }

      return { user, session }
    })
}
```

### Pattern: Flag spesial (QC, reviewer, auditor)

Kadang perlu memberi akses lebih tinggi ke user tertentu **tanpa
mengubah role** mereka. Gunakan flag boolean:

```typescript
// Di schema
is_reviewer Boolean @default(false)

// Di RBAC
const effectiveLevel = user.is_reviewer
  ? Math.max(ROLE_HIERARCHY[user.role], ROLE_HIERARCHY.reviewer)
  : ROLE_HIERARCHY[user.role]
```

Flag ini berguna untuk:
- Tim QA yang butuh akses baca semua fitur
- Auditor eksternal yang butuh akses view-only
- Support staff yang butuh akses elevated sementara

---

## Tenant Middleware — Pola Multi-tenant

### Masalah

Aplikasi multi-tenant butuh memastikan setiap request hanya mengakses
data milik tenant yang benar. Tanpa middleware, developer harus
menyertakan filter tenant di SETIAP query — rawan lupa.

### Solusi: Middleware + Row-Level Security

```
Request masuk
  │
  ▼
┌──────────────────────┐
│ tenantMiddleware     │
│                      │
│ 1. Resolve tenantId  │  ← dari user profile / header / URL
│ 2. Validasi akses    │  ← cek user punya hak ke tenant ini
│ 3. Set DB context    │  ← SET app.current_tenant_id = 'xxx'
│ 4. Fetch data tenant │  ← lookup untuk response
└──────────┬───────────┘
  │  { user, tenant }
  ▼
Route handler
  │  Prisma query: db.user.findMany()
  │  (RLS otomatis filter WHERE tenant_id = current_setting('app.current_tenant_id'))
  ▼
Database
```

### Pola resolve tenant

```typescript
// middleware/tenant.ts
function tenantMiddleware() {
  return new Elysia()
    .derive(async ({ request, user }) => {
      let tenantId: string | null = null

      if (user.role === 'super_admin') {
        // Admin memilih tenant via header
        tenantId = request.headers.get('X-Tenant-Id')
      } else if (user.role === 'manager' || user.role === 'viewer') {
        // User biasa: tenant dari profil
        tenantId = user.tenantId
      }

      if (!tenantId) {
        return { user, tenant: null }
      }

      // Validasi akses (opsional)
      const tenant = await db.tenant.findUnique({ where: { id: tenantId } })
      if (!tenant) throw new Error('Tenant tidak ditemukan')

      // Set PostgreSQL RLS context
      await db.$executeRaw`
        SELECT set_config('app.current_tenant_id', ${tenantId}, true)
      `

      return { user, tenant }
    })
}
```

### PostgreSQL RLS (opsional tapi direkomendasikan)

```sql
-- Aktifkan RLS di setiap tabel tenant
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa lihat data tenant-nya
CREATE POLICY tenant_isolation ON orders
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id'));
```

Dengan RLS, query `db.order.findMany()` otomatis ter-filter — tidak
mungkin lupa menambahkan `WHERE tenant_id = ...`.

---

## Auth Middleware — Pola Optional vs Required

```typescript
// middleware/auth.ts

// Optional: user bisa null
const authMiddleware = new Elysia()
  .derive(async ({ request }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      })
      return session
        ? { user: session.user, session: session.session }
        : { user: null, session: null }
    } catch {
      return { user: null, session: null }
    }
  })

// Required: lempar 401 jika tidak ada session
const requireAuth = new Elysia()
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    if (!session) throw new Error('Unauthorized')
    return { user: session.user, session: session.session }
  })
  .onError(({ code, error }) => {
    if (error.message === 'Unauthorized') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  })
```

### Kapan pakai yang mana?

| Middleware | Use case |
|---|---|
| `authMiddleware` | Halaman publik yang butuh info user opsional (navbar, welcome message) |
| `requireAuth` | Semua endpoint yang butuh user login |
| `requireRole(level)` | Endpoint dengan akses terbatas per role |
| `tenantMiddleware` | Endpoint yang operasi di konteks tenant spesifik |

---

## Auth Sekunder — JWT untuk End-User

### Kapan butuh auth terpisah?

Jika aplikasi melayani **dua jenis user yang sangat berbeda**:

| Aspek | Admin/Internal | End-user/Customer |
|---|---|---|
| Metode login | Google OAuth | OTP / Magic Link |
| Jumlah user | Puluhan | Ribuan-jutaan |
| Session | Better Auth (DB-backed) | JWT (stateless) |
| Expiry | Beberapa jam-hari | 7 hari |
| Security need | Tinggi | Sedang |
| Tabel user | `User` | `Customer` / `EndUser` |

**Jangan gabung dalam satu sistem.** Auth sekunder cukup dengan JWT
cookie — lebih ringan, tidak perlu lookup DB setiap request.

```typescript
// lib/customer-session.ts
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.CUSTOMER_JWT_SECRET)

export async function createCustomerSession(customer: Customer): Promise<string> {
  return new SignJWT({
    sub: customer.id,
    tenantId: customer.tenantId,
    phone: customer.phone,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyCustomerSession(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload as { sub: string; tenantId: string; phone: string }
}
```

---

## Dev Auth Bypass — Pola Testing

### Masalah

Google OAuth tidak bisa diotomasi di Playwright / MCP / CI. Butuh
cara untuk login di environment development tanpa Google.

### Solusi: Endpoint dev-only

```typescript
// routes/api/dev-auth.ts
// HANYA aktif di NODE_ENV=development

if (process.env.NODE_ENV === 'production') {
  return Response.json({ error: 'Not found' }, { status: 404 })
}

// POST /api/dev-auth/login-as — login sebagai user apa saja
async function loginAs(email: string, name?: string) {
  // 1. Find atau create user
  let user = await db.user.findUnique({ where: { email } })
  if (!user) {
    user = await db.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        role: 'user',
        status: 'active',
        emailVerified: true,
      },
    })
  }

  // 2. Buat session Better Auth langsung
  const session = await auth.api.createSession({
    userId: user.id,
    headers: new Headers(), // kosong — dev
  })

  // 3. Set cookie
  const cookie = await auth.api.createSessionCookie(session)
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': cookie,
      'Location': '/dashboard',
    },
  })
}
```

### Tiga endpoint standar

| Method | Path | Keterangan |
|---|---|---|
| `POST` | `/api/dev-auth/login` | Login sebagai admin (email harus di whitelist) |
| `POST` | `/api/dev-auth/login-as` | Login sebagai user apa saja, auto-create |
| `GET` | `/api/dev-auth/login-as/:email?redirect=` | Navigasi browser + redirect (untuk Playwright) |

### Security: pastikan 404 di production

```typescript
// Di handler paling atas
if (process.env.NODE_ENV !== 'development') {
  return new Response(null, { status: 404 })
}
```

---

## Session — Cache vs No-Cache

```
cookieCache: true                          cookieCache: false
┌──────────────────────┐                  ┌──────────────────────┐
│ Request 1            │                  │ Request 1            │
│  ▼                   │                  │  ▼                   │
│ Validasi session     │                  │ Validasi session     │
│ (DB query)           │                  │ (DB query)           │
│  ▼                   │                  │  ▼                   │
│ Cache result 5 min   │                  │ No cache             │
│                      │                  │                      │
│ Request 2 (1 min)    │                  │ Request 2 (1 min)    │
│  ▼                   │                  │  ▼                   │
│ Cache hit (no DB)    │                  │ Validasi session     │
│                      │                  │ (DB query lagi)      │
└──────────────────────┘                  └──────────────────────┘
  Latensi rendah                            Latensi lebih tinggi
  Tapi: revoke butuh 5 min                  Tapi: revoke instant
  untuk berlaku                             berlaku di request berikutnya
```

**Pilih `false` jika:**
- Aplikasi internal / admin (jumlah user sedikit, DB query ringan)
- Butuh revoke session instant (user di-suspend langsung terblokir)
- Toleransi latensi lebih tinggi

**Pilih `true` jika:**
- Aplikasi publik high-traffic (ribuan request/detik)
- Revoke session tidak butuh instant
- Ingin mengurangi load database

---

## Checklist Implementasi

Saat membangun auth untuk project baru, jawab pertanyaan ini:

- [ ] Siapa user-nya? Internal admin saja, atau ada end-user juga?
- [ ] Butuh dual auth? (Better Auth + JWT terpisah)
- [ ] Social provider apa saja? (Google, GitHub, Apple, Microsoft)
- [ ] Butuh email/password? (tidak direkomendasikan kecuali benar-benar perlu)
- [ ] Ada berapa tingkat role? Gambar hierarki-nya
- [ ] Ada flag spesial? (reviewer, auditor, QC)
- [ ] Multi-tenant? Bagaimana resolve tenant ID-nya?
- [ ] Pakai RLS? (PostgreSQL only, butuh setup policy)
- [ ] Session cache: true atau false?
- [ ] Custom fields apa yang harus ada di user?
- [ ] Auto-promote admin dari env var?
- [ ] Status lifecycle seperti apa? (pending → active → suspended)
- [ ] Butuh dev-auth bypass untuk testing?
- [ ] Login page flow: kemana redirect setelah login?

---

## Contoh Konkret — Aplikasi Multi-Tenant SaaS

Di bawah adalah contoh nyata dari project ini sebagai referensi
implementasi. Sesuaikan dengan domain kamu.

### Role hierarchy (5 tingkat)

```
platform_admin (5) — akses semua tenant, dashboard global
qc             (4) — akses baca setara admin, flag spesial
manager        (3) — kelola editor + viewer di tenant-nya
editor         (2) — kelola viewer di tenant-nya
viewer         (1) — akses terbatas sesuai permissions
```

### Middleware stack di route

```typescript
// Route tenant — minimal viewer
const tenantRoutes = new Elysia({ prefix: '/tenant' })
  .use(requireRole('viewer'))
  .use(tenantMiddleware)
  .get('/data', async ({ tenant }) => { /* ... */ })

// Route admin — minimal qc
const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(requireRole('qc'))
  .get('/stats', async ({ user }) => { /* ... */ })

// Route publik — tanpa auth
const publicRoutes = new Elysia({ prefix: '/public' })
  .get('/info', async () => { /* ... */ })
```

### Auto-promote admin

```typescript
// .env
ADMIN_EMAILS=alice@company.com,bob@company.com

// databaseHooks.user.create.after
const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) ?? []
if (adminEmails.includes(user.email)) {
  await db.user.update({
    where: { id: user.id },
    data: { role: 'platform_admin', status: 'active' },
  })
}
```

### Scoped admin (admin terbatas)

Tidak semua admin bisa mengakses semua tenant. Admin dengan scope
terbatas hanya bisa mengakses tenant yang terdaftar di `managed_tenant_ids`:

```typescript
// Di tenant middleware
if (user.role === 'platform_admin' && user.managedTenantIds !== null) {
  if (!user.managedTenantIds.includes(tenantId)) {
    throw new Error('Forbidden: tenant tidak dalam scope')
  }
}
```

`null` = akses semua tenant. Array kosong `[]` = tidak bisa akses tenant manapun.

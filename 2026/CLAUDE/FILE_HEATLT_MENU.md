# File Health Panel

## Nama Fitur

**File Health Panel** — panel monitoring kesehatan ukuran file source code.

---

## Tujuan

Setiap file source code punya batas ukuran (baris + karakter) berdasarkan kategorinya. Ketika file tumbuh terlalu besar, kode menjadi sulit dibaca, sulit di-maintain, dan rentan terhadap god-class/god-module anti-pattern.

File Health Panel memberikan visibilitas langsung kepada developer:
- File mana yang mendekati atau sudah melebihi batas
- Berapa persen limit yang sudah terpakai
- Di kategori apa file tersebut (route, service, component, dll)

Ini adalah **alat self-enforcement** — bukan CI gate, tapi early warning system agar developer tahu kapan harus refactor sebelum file tidak bisa dikontrol.

---

## Fitur-Fitur

### 1. Scan Otomatis Seluruh Source File
Memindai semua file `.ts` / `.tsx` di direktori `src/`, `tests/`, `prisma/` (kecuali `generated/`, `node_modules/`, `dist/`).

### 2. Kategorisasi File Otomatis
Setiap file dikategorikan berdasarkan path-nya:

| Kategori | Pola Path | Maks Baris | Maks Char |
|---|---|---|---|
| `route` | `src/frontend/routes/` | 150 | 6.000 |
| `service` | `src/lib/`, service layer | 300 | 12.000 |
| `repository` | query/repo layer | 250 | 10.000 |
| `schema` | validasi/schema | 200 | 8.000 |
| `types` | types/interfaces | 300 | 10.000 |
| `utility` | helper/util | 200 | 8.000 |
| `config` | config file | 100 | 4.000 |
| `test` | `tests/` | 400 | 16.000 |
| `component` | `src/frontend/components/` | 300 | 12.000 |
| `hook` | `src/frontend/hooks/` | 200 | 8.000 |

**Hard limit global: 500 baris / 20.000 char** (kecuali generated files).

### 3. Status Health per File
Setiap file mendapat status:
- OK — di bawah 80% limit
- Warning — antara 80%-100% limit (perlu perhatian)
- Critical — melebihi limit (wajib refactor)

### 4. Tampilan Panel
- Tabel dengan kolom: file path, kategori, baris, karakter, % baris, % char, status
- Filter by status via `SegmentedControl` (All / Critical / Warning / OK) — reset ke halaman 1 saat berubah
- Sort by % pemakaian (default: tertinggi di atas)
- Badge ringkasan di header: total file, berapa OK/warning/critical

### 5. Highlight File Paling Kritis
File paling mendekati/melebihi limit muncul di urutan teratas karena hasil dari backend sudah di-sort descending by `max(linePercent, charPercent)`.

### 6. Copy File Path
Tiga mode copy, semua menggunakan `useClipboard` dari `@mantine/hooks` (ikon berubah ke `TbCopyCheck` + timeout 1,5 detik sebagai feedback):

| Mode | Cara | Output |
|---|---|---|
| **Satuan** | Klik icon copy di setiap baris | Path file tersebut |
| **Beberapa** | Centang checkbox baris → klik "Copy Selected (N)" | Satu path per baris, hanya yang dipilih |
| **Semua** | Klik "Copy All (N)" di toolbar | Satu path per baris, semua file sesuai filter aktif (bukan hanya halaman ini) |

Checkbox header berlaku untuk **semua** file yang sedang terfilter (bukan hanya halaman aktif). Klik baris juga toggle seleksi (selain klik checkbox-nya langsung). Seleksi persist saat pindah halaman; reset saat filter berubah.

### 7. Pagination
- Default **25 file/halaman**; bisa diganti ke 10/25/50/100 via `Select`
- Komponen `Pagination` Mantine di footer dengan edge buttons (⏮ ⏭)
- Info kiri footer: `N file · hal X/Y · M dipilih`
- Ganti page size → reset ke halaman 1
- "Copy All" selalu copy seluruh file terfilter, bukan hanya halaman aktif

---

## Stack yang Dibutuhkan

### Backend
- **Runtime**: Bun (atau Node.js — hanya pakai `node:fs` dan `node:path`)
- **Framework**: Elysia.js (atau Express/Hono/Fastify — logika sama)
- **Auth**: session middleware (`requireSuperAdmin` atau ekuivalen)
- **Tidak butuh database** — murni filesystem scan

### Frontend
- **React** 18+
- **Mantine UI** — `Table`, `Badge`, `Progress`, `SegmentedControl`, `Select`, `Pagination`, `Checkbox`, `Button`, `ActionIcon`, `Stack`, `Group`, `Text`
- **`useClipboard`** dari `@mantine/hooks` — copy dengan feedback visual otomatis
- **TanStack Query** — `useQuery` untuk fetch data dari endpoint
- **react-icons** — `TbCopy`, `TbCopyCheck`, ikon status

### Endpoint Baru yang Perlu Dibuat
```
GET /api/admin/file-health
```
Response:
```typescript
{
  files: {
    path: string
    category: string
    lines: number
    chars: number
    maxLines: number
    maxChars: number
    linePercent: number   // lines / maxLines * 100
    charPercent: number   // chars / maxChars * 100
    status: 'ok' | 'warning' | 'critical'
  }[]
  summary: {
    total: number
    ok: number
    warning: number
    critical: number
    byCategory: Record<string, { total: number; critical: number }>
  }
}
```

> **Catatan project ini**: Endpoint `GET /api/admin/project-structure` sudah return `lines` per file. Endpoint baru `file-health` perlu tambah `chars` dan logic limit-checking.

---

## Cara Membuat Ulang di Project Lain

### Langkah 1 — Definisikan Limit per Kategori

```typescript
// src/lib/file-health-limits.ts
export const FILE_HEALTH_LIMITS: Record<string, { maxLines: number; maxChars: number }> = {
  route:      { maxLines: 150,  maxChars: 6_000  },
  service:    { maxLines: 300,  maxChars: 12_000 },
  repository: { maxLines: 250,  maxChars: 10_000 },
  schema:     { maxLines: 200,  maxChars: 8_000  },
  types:      { maxLines: 300,  maxChars: 10_000 },
  utility:    { maxLines: 200,  maxChars: 8_000  },
  config:     { maxLines: 100,  maxChars: 4_000  },
  test:       { maxLines: 400,  maxChars: 16_000 },
  component:  { maxLines: 300,  maxChars: 12_000 },
  hook:       { maxLines: 200,  maxChars: 8_000  },
  default:    { maxLines: 500,  maxChars: 20_000 },
}

export function categorizeFile(filePath: string): string {
  if (filePath.includes('/routes/'))     return 'route'
  if (filePath.includes('/hooks/'))      return 'hook'
  if (filePath.includes('/components/')) return 'component'
  if (filePath.includes('/lib/'))        return 'service'
  if (filePath.match(/\.(test|spec)\./)) return 'test'
  if (filePath.includes('/tests/'))      return 'test'
  if (filePath.includes('config'))       return 'config'
  if (filePath.match(/\.(types|interfaces)\./)) return 'types'
  return 'default'
}
```

### Langkah 2 — Buat Endpoint Backend

```typescript
// Di dalam router admin (Elysia / Express / Hono)
.get('/api/admin/file-health', async ({ request, set }) => {
  const caller = await requireSuperAdmin(request)
  if (!caller) return forbidden(set)

  const fs = await import('node:fs')
  const path = await import('node:path')
  const root = process.cwd()
  const SKIP_DIRS = new Set(['node_modules', 'dist', 'generated', '.git'])
  const SKIP_PATTERNS = [/\.generated\./, /routeTree\.gen/, /\.d\.ts$/]

  const results: FileHealthEntry[] = []

  function scan(dir: string) {
    const abs = path.join(root, dir)
    if (!fs.existsSync(abs)) return
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue
      const rel = path.join(dir, entry.name).replace(/\\/g, '/')
      if (entry.isDirectory()) {
        scan(rel)
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        if (SKIP_PATTERNS.some(p => p.test(rel))) continue
        const content = fs.readFileSync(path.join(root, rel), 'utf-8')
        const lines = content.split('\n').length
        const chars = content.length
        const category = categorizeFile(rel)
        const limit = FILE_HEALTH_LIMITS[category] ?? FILE_HEALTH_LIMITS.default
        const linePercent = Math.round((lines / limit.maxLines) * 100)
        const charPercent = Math.round((chars / limit.maxChars) * 100)
        const maxPct = Math.max(linePercent, charPercent)
        const status = maxPct >= 100 ? 'critical' : maxPct >= 80 ? 'warning' : 'ok'
        results.push({
          path: rel, category, lines, chars,
          maxLines: limit.maxLines, maxChars: limit.maxChars,
          linePercent, charPercent, status,
        })
      }
    }
  }

  for (const dir of ['src', 'tests', 'prisma']) scan(dir)
  results.sort((a, b) => Math.max(b.linePercent, b.charPercent) - Math.max(a.linePercent, a.charPercent))

  const ok       = results.filter(f => f.status === 'ok').length
  const warning  = results.filter(f => f.status === 'warning').length
  const critical = results.filter(f => f.status === 'critical').length

  return { files: results, summary: { total: results.length, ok, warning, critical } }
})
```

### Langkah 3 — Buat Frontend Panel

```tsx
// src/frontend/components/dev/FileHealthPanel.tsx
import {
  ActionIcon, Badge, Box, Button, Checkbox, Group,
  Pagination, Progress, SegmentedControl, Select,
  Stack, Table, Text, Title, Tooltip,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  TbActivity, TbAlertTriangle, TbCircleCheck, TbCircleX,
  TbCopy, TbCopyCheck,
} from 'react-icons/tb'

type FileStatus = 'ok' | 'warning' | 'critical'
interface FileEntry {
  path: string; category: string; lines: number; chars: number
  maxLines: number; maxChars: number
  linePercent: number; charPercent: number; status: FileStatus
}
interface FileHealthData {
  files: FileEntry[]
  summary: { total: number; ok: number; warning: number; critical: number }
}

const STATUS = {
  ok:       { color: 'green',  Icon: TbCircleCheck,  label: 'OK'       },
  warning:  { color: 'yellow', Icon: TbAlertTriangle, label: 'Warning'  },
  critical: { color: 'red',    Icon: TbCircleX,       label: 'Critical' },
} as const

// Komponen copy ikon per baris (satuan)
function CopyRowIcon({ text }: { text: string }) {
  const cb = useClipboard({ timeout: 1500 })
  return (
    <Tooltip label={cb.copied ? 'Copied!' : 'Copy path'} withArrow>
      <ActionIcon size="xs" variant="subtle" color={cb.copied ? 'green' : 'gray'}
        onClick={(e) => { e.stopPropagation(); cb.copy(text) }}>
        {cb.copied ? <TbCopyCheck size={12} /> : <TbCopy size={12} />}
      </ActionIcon>
    </Tooltip>
  )
}

export function FileHealthPanel() {
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const cbAll = useClipboard({ timeout: 1500 })
  const cbSelected = useClipboard({ timeout: 1500 })

  const { data, isLoading } = useQuery<FileHealthData>({
    queryKey: ['admin', 'file-health'],
    queryFn: () => fetch('/api/admin/file-health', { credentials: 'include' }).then(r => r.json()),
  })

  // Semua file sesuai filter aktif
  const files = (data?.files ?? []).filter(f => filter === 'all' || f.status === filter)
  const s = data?.summary

  // Pagination
  const totalPages = Math.max(1, Math.ceil(files.length / pageSize))
  const paged = files.slice((page - 1) * pageSize, page * pageSize)

  // Path untuk copy
  const allPaths = files.map(f => f.path)            // semua (sesuai filter, lintas halaman)
  const selectedPaths = allPaths.filter(p => selected.has(p))

  // Checkbox state
  const allChecked = files.length > 0 && files.every(f => selected.has(f.path))
  const someChecked = files.some(f => selected.has(f.path))

  const toggleRow = (path: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(path) ? n.delete(path) : n.add(path); return n })

  const toggleAll = () =>
    setSelected(prev => allChecked
      ? (allPaths.forEach(p => prev.delete(p)), new Set(prev))
      : new Set([...prev, ...allPaths]))

  const resetPage = (v: string) => { setFilter(v); setSelected(new Set()); setPage(1) }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Group gap="xs"><TbActivity size={22} /><Title order={3}>File Health</Title></Group>
        {s && (
          <Group gap="xs">
            <Badge color="green" variant="light">{s.ok} OK</Badge>
            <Badge color="yellow" variant="light">{s.warning} Warning</Badge>
            <Badge color="red" variant="light">{s.critical} Critical</Badge>
          </Group>
        )}
      </Group>

      {/* Toolbar: filter + tombol copy semua / copy selected */}
      <Group justify="space-between">
        <SegmentedControl value={filter} onChange={resetPage} w="fit-content"
          data={[
            { value: 'all',      label: `All${s ? ` (${s.total})` : ''}` },
            { value: 'critical', label: `Critical${s ? ` (${s.critical})` : ''}` },
            { value: 'warning',  label: `Warning${s ? ` (${s.warning})` : ''}` },
            { value: 'ok',       label: `OK${s ? ` (${s.ok})` : ''}` },
          ]}
        />
        <Group gap="xs">
          {someChecked && (
            <Button size="xs" variant="light" color={cbSelected.copied ? 'green' : 'blue'}
              leftSection={cbSelected.copied ? <TbCopyCheck size={14} /> : <TbCopy size={14} />}
              onClick={() => cbSelected.copy(selectedPaths.join('\n'))}>
              {cbSelected.copied ? 'Copied!' : `Copy Selected (${selectedPaths.length})`}
            </Button>
          )}
          <Button size="xs" variant="light" color={cbAll.copied ? 'green' : 'gray'}
            leftSection={cbAll.copied ? <TbCopyCheck size={14} /> : <TbCopy size={14} />}
            onClick={() => cbAll.copy(allPaths.join('\n'))} disabled={files.length === 0}>
            {cbAll.copied ? 'Copied!' : `Copy All (${files.length})`}
          </Button>
        </Group>
      </Group>

      {isLoading ? <Text c="dimmed" size="sm">Loading...</Text> : (
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder withColumnBorders fz="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={36}>
                  <Checkbox size="xs" checked={allChecked}
                    indeterminate={someChecked && !allChecked} onChange={toggleAll} />
                </Table.Th>
                <Table.Th>File</Table.Th>
                <Table.Th w={90}>Category</Table.Th>
                <Table.Th w={150}>Lines</Table.Th>
                <Table.Th w={150}>Chars</Table.Th>
                <Table.Th w={90}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paged.map(f => {
                const cfg = STATUS[f.status]
                const Icon = cfg.Icon
                const lc = f.linePercent >= 100 ? 'red' : f.linePercent >= 80 ? 'yellow' : 'green'
                const cc = f.charPercent >= 100 ? 'red' : f.charPercent >= 80 ? 'yellow' : 'green'
                const isSel = selected.has(f.path)
                return (
                  <Table.Tr key={f.path} onClick={() => toggleRow(f.path)}
                    bg={isSel ? 'var(--mantine-color-blue-light)' : undefined}
                    style={{ cursor: 'pointer' }}>
                    <Table.Td onClick={e => e.stopPropagation()}>
                      <Checkbox size="xs" checked={isSel} onChange={() => toggleRow(f.path)} />
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Text size="xs" ff="monospace" style={{ wordBreak: 'break-all' }}>{f.path}</Text>
                        <CopyRowIcon text={f.path} />  {/* copy satuan */}
                      </Group>
                    </Table.Td>
                    <Table.Td><Badge variant="dot" size="sm" color="blue">{f.category}</Badge></Table.Td>
                    <Table.Td>
                      <Stack gap={3}>
                        <Group gap={4} justify="space-between">
                          <Text size="xs">{f.lines}/{f.maxLines}</Text>
                          <Text size="xs" c={lc} fw={f.linePercent >= 80 ? 600 : 400}>{f.linePercent}%</Text>
                        </Group>
                        <Progress value={Math.min(f.linePercent, 100)} color={lc} size="sm" />
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={3}>
                        <Group gap={4} justify="space-between">
                          <Text size="xs">{f.chars.toLocaleString()}/{f.maxChars.toLocaleString()}</Text>
                          <Text size="xs" c={cc} fw={f.charPercent >= 80 ? 600 : 400}>{f.charPercent}%</Text>
                        </Group>
                        <Progress value={Math.min(f.charPercent, 100)} color={cc} size="sm" />
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <Icon size={14} color={`var(--mantine-color-${cfg.color}-6)`} />
                        <Text size="xs" c={cfg.color} fw={500}>{cfg.label}</Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
              {files.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text c="dimmed" size="sm" ta="center" py="md">Tidak ada file</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>
      )}

      {/* Footer: info + page size + pagination */}
      {files.length > 0 && (
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <Text size="xs" c="dimmed">
              {files.length} file · hal {page}/{totalPages}
              {someChecked ? ` · ${selectedPaths.length} dipilih` : ''}
            </Text>
            <Select size="xs" w={80} value={String(pageSize)}
              onChange={v => { setPageSize(Number(v)); setPage(1) }}
              data={['10', '25', '50', '100']} allowDeselect={false} />
            <Text size="xs" c="dimmed">/ hal</Text>
          </Group>
          <Pagination value={page} onChange={setPage} total={totalPages} size="xs" withEdges />
        </Group>
      )}
    </Stack>
  )
}
```

### Langkah 4 — Daftarkan ke Dev Console

Di file dev console (contoh: `src/frontend/routes/dev.tsx` atau panel list):

```typescript
// Tambah ke daftar sub-view
const DEV_PANELS = [
  // ... panel lain
  { key: 'file-health', label: 'File Health', component: FileHealthPanel },
]
```

---

## Checklist Implementasi

- [ ] Definisikan limit per kategori sesuai konvensi project (lihat Langkah 1)
- [ ] Buat endpoint `GET /api/admin/file-health` (hanya SUPER_ADMIN)
- [ ] Tulis test: endpoint return data valid, file critical terdeteksi
- [ ] Buat komponen `FileHealthPanel.tsx` dengan fitur:
  - [ ] Filter status via `SegmentedControl` (All/Critical/Warning/OK)
  - [ ] Copy satuan — icon copy per baris menggunakan `useClipboard`
  - [ ] Copy beberapa — checkbox per baris + tombol "Copy Selected (N)"
  - [ ] Copy semua — tombol "Copy All (N)" di toolbar (semua file terfilter, bukan hanya halaman aktif)
  - [ ] Pagination — default 25/hal, pilihan 10/25/50/100, dengan info footer dan `Pagination` Mantine
- [ ] Tambah `'file-health'` ke `validTabs` di file route definition (jika pakai TanStack Router `validateSearch`)
- [ ] Daftarkan ke dev console / admin panel
- [ ] (Opsional) Tambah MCP tool `file_health_list` untuk inspeksi via AI

---

## Contoh Output Endpoint

```json
{
  "files": [
    {
      "path": "src/routes/admin/analytics.ts",
      "category": "service",
      "lines": 922,
      "chars": 31840,
      "maxLines": 300,
      "maxChars": 12000,
      "linePercent": 307,
      "charPercent": 265,
      "status": "critical"
    }
  ],
  "summary": {
    "total": 87,
    "ok": 72,
    "warning": 8,
    "critical": 7
  }
}
```

---

## Catatan Khusus Project envman

- Endpoint `GET /api/admin/project-structure` sudah ada di `src/routes/admin/analytics.ts` dan return `lines` — bisa di-extend untuk tambah `chars` dan limit-check tanpa endpoint baru
- File `src/routes/admin/analytics.ts` sendiri sudah **critical** (922 baris dari limit 300) — kandidat pertama yang perlu refactor saat FileHealthPanel diimplementasikan
- Lokasi panel baru: `src/frontend/components/dev/FileHealthPanel.tsx` — daftarkan sebagai sub-view di `dev-project.tsx`

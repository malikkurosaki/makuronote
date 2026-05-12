# FILE-HEALTH — Aturan Ukuran & Struktur File

Aturan ini berlaku untuk semua file dalam project ini.
Tujuan: menjaga file tetap kecil, kohesif, dan mudah diproses oleh AI maupun manusia.

---

## Batas Ukuran File

| Tipe File | Maks Baris | Maks Karakter | Keterangan |
|-----------|-----------|---------------|------------|
| Route handler | 150 | 6.000 | Satu file = satu resource |
| Service / use-case | 300 | 12.000 | Satu file = satu domain logic |
| Repository / query | 250 | 10.000 | Pisah per entity |
| Schema / validation | 200 | 8.000 | Pisah per domain |
| Types / interfaces | 300 | 10.000 | Boleh agregat, tapi per modul |
| Utility / helper | 200 | 8.000 | Satu concern per file |
| Config | 100 | 4.000 | Tidak ada logic bisnis |
| Test file | 400 | 16.000 | Satu file test per satu unit |

> **Hard limit global:** Tidak ada file yang boleh melebihi **500 baris** atau **20.000 karakter**,
> kecuali file yang di-generate otomatis (migration, seed, generated types).

---

## Aturan Wajib

### 1. Satu File, Satu Tanggung Jawab
- Setiap file harus bisa dijelaskan dalam satu kalimat pendek.
- Jika penjelasannya butuh kata "dan" lebih dari sekali → **pecah file-nya**.

### 2. Tidak Ada "God File"
- Dilarang menaruh lebih dari satu route group dalam satu file handler.
- Dilarang mencampur business logic dengan transport layer (HTTP, WS, queue).
- Dilarang mencampur type definition dengan implementation dalam satu file yang panjang.

### 3. Penamaan File Harus Eksplisit
- Nama file harus mencerminkan isi secara tepat.
- Hindari nama generik: `utils.ts`, `helpers.ts`, `common.ts`, `misc.ts`.
- Gunakan pola: `[domain].[layer].ts` → contoh: `user.service.ts`, `payment.repository.ts`.

### 4. Index File Hanya Untuk Re-export
- File `index.ts` hanya boleh berisi re-export, **bukan** implementasi.
- Maksimal 50 baris untuk file index.

### 5. Tidak Ada Barrel Import yang Dalam
- Hindari barrel yang mengimpor dari barrel lain lebih dari 2 level.
- Ini membuat AI sulit trace dependency dengan akurat.

---

## Kapan Harus Pecah File

Pecah file segera jika salah satu kondisi ini terpenuhi:

- [ ] File melebihi batas karakter/baris di tabel di atas
- [ ] Ada dua fungsi/class yang tidak saling bergantung dalam satu file
- [ ] File mengandung lebih dari 3 exported symbol utama
- [ ] File sulit diberi nama yang spesifik tanpa kata "dan"
- [ ] Edit di satu bagian file sering menyebabkan konflik di bagian lain

---

## Pola Pemecahan File yang Dianjurkan

### Service yang Terlalu Besar
```
// SEBELUM: user.service.ts (600 baris)

// SESUDAH:
user.service.ts          // orchestration, max 150 baris
user.query.service.ts    // read operations
user.command.service.ts  // write operations
user.notification.service.ts // side effects
```

### Handler yang Terlalu Besar
```
// SEBELUM: user.route.ts (400 baris)

// SESUDAH:
user.route.ts            // route registration only
user.handler.ts          // handler functions
user.middleware.ts        // route-specific middleware
```

### Types yang Terlalu Besar
```
// SEBELUM: types.ts (500 baris)

// SESUDAH:
types/user.types.ts
types/payment.types.ts
types/shared.types.ts
```

---

## Instruksi Khusus untuk AI

Ketika bekerja dalam project ini, **Claude wajib**:

1. **Menolak menambah kode** ke file yang sudah mendekati atau melebihi batas,
   kecuali penambahannya memang sangat kecil (< 10 baris) dan kohesif.

2. **Proaktif menyarankan refactor** saat mendeteksi file yang tumbuh tidak sehat,
   sebelum menambahkan fitur baru ke file tersebut.

3. **Tidak membuat "helper dump"** — setiap helper harus punya file sendiri
   yang namanya spesifik, bukan ditumpuk ke file utils yang ada.

4. **Selalu buat file baru** jika implementasi baru tidak secara alami masuk
   ke salah satu file yang sudah ada.

5. **Periksa ukuran file saat ini** sebelum mengedit — jika sudah > 80% dari
   batas, sarankan pecah terlebih dahulu.

---

## Pengecualian

File berikut **dikecualikan** dari aturan batas ukuran:

- `*.generated.ts` — file hasil code generation (Prisma, tRPC, dll)
- `*.migration.ts` / `*_migration.sql` — file migrasi database
- `*.seed.ts` — file seeding data
- File di folder `__fixtures__/` atau `__mocks__/`

Pengecualian **tidak berlaku** untuk file konfigurasi runtime seperti
`elysia.config.ts`, `app.ts`, atau `server.ts` — file ini tetap harus ringkas.

---

*Letakkan file ini di root project atau sertakan referensinya di `CLAUDE.md`.*

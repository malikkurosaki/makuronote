# AI-CONTRACT.md

Kontrak kerja antara **manusia (developer)** dan **AI assistant** (Claude Code,
Cursor, Copilot, atau agent coding lainnya) di repo ini. Tujuannya satu:
mencegah perbaikan 1 bug berubah jadi 3 bug baru (bug eksponensial). AI
**wajib** baca file ini sebelum menulis/menghapus kode.

---

## 1. Prinsip Dasar

1. **Minimal diff, maximal pemahaman.** Baca kode sebelum ubah. Jangan
   refactor yang tidak diminta. Jangan "rapikan" kode di sekitar bug.
2. **Fix akar, bukan gejala.** Kalau error muncul di layer A tapi penyebab
   di layer B, perbaiki B. Jangan tambal di A.
3. **Satu masalah = satu perubahan logis.** Jangan campur fix bug dengan
   refactor, rename, atau fitur baru dalam satu sesi tanpa izin.
4. **Tidak ada asumsi diam-diam.** Kalau butuh info (nama field, endpoint,
   flow, schema), tanya atau baca kode — jangan tebak.
5. **Setiap perubahan harus reversible.** Diff kecil, commit jelas, bisa
   di-revert tanpa efek samping.

---

## 2. Sebelum Menulis Kode

Checklist wajib sebelum edit file:

- [ ] Sudah baca file target (bukan cuma potongan)
- [ ] Tahu siapa yang memanggil fungsi/komponen yang akan diubah
- [ ] Tahu apakah ada test/konsumer lain yang bergantung padanya
- [ ] Tahu layer yang benar (route / controller / component / hook /
      service / repository / lib / util — sesuai arsitektur project)
- [ ] Cek dokumen panduan project (mis. `CLAUDE.md`, `CONTRIBUTING.md`,
      `ARCHITECTURE.md`, ADR) untuk aturan spesifik
- [ ] Kalau ubah tipe/kontrak (API, function signature, schema), cek
      semua pemakai

Jika salah satu tidak jelas: **berhenti, baca lagi, atau tanya user.**

---

## 3. Saat Fix Bug

1. **Reproduksi dulu di kepala.** Jelaskan (minimal ke diri sendiri)
   kenapa bug terjadi sebelum menyentuh kode.
2. **Temukan akar sebenarnya.** "Karena field X `undefined`/`null`/empty"
   bukan akar — akarnya kenapa X bisa kosong.
3. **Perbaiki sekecil mungkin.** Kalau cukup 3 baris, jangan ubah 30.
4. **Jangan tambah try/catch hanya untuk menyembunyikan error** — itu
   melahirkan bug baru yang lebih sulit dilacak.
5. **Jangan tambah fallback/default value spekulatif.** Kalau field
   seharusnya selalu ada, perbaiki kenapa bisa kosong.
6. **Jangan rename, reorder, atau reformat** di file yang sama kecuali
   langsung terkait fix.
7. **Setelah fix, verifikasi**: minimal jalankan typecheck/lint sesuai
   tooling project (mis. `tsc`, `eslint`, `ruff`, `mypy`, `cargo check`,
   `go vet`, `rspec`, dll). Idealnya jalankan test suite yang relevan.

---

## 4. Yang Dilarang (Akar Bug Eksponensial)

- ❌ **Silent catch**: `catch (e) {}`, `except: pass`, `_ = err`, atau
  pola serupa — tanpa alasan yang didokumentasi di komentar.
- ❌ **Comment-out kode** sebagai "backup". Hapus atau kembalikan, jangan
  biarkan mayat — git sudah jadi backup.
- ❌ **Copy-paste antar file**. Extract ke shared module/util/helper.
- ❌ **Duplikasi util/helper/hook/service** yang sudah ada — cek dulu
  sebelum bikin baru.
- ❌ **Tambah flag/opsi/parameter baru** hanya untuk menghindari break
  konsumer lama — fix konsumernya sekalian.
- ❌ **Destructive git command** (`reset --hard`, `push --force`,
  `branch -D`, `clean -fdx`) tanpa instruksi eksplisit.
- ❌ **Skip hook** (`--no-verify`, `--no-gpg-sign`) tanpa izin.
- ❌ **Ubah schema/migrasi database** tanpa migration file yang sesuai.
- ❌ **Tambah dependency baru** tanpa izin user.
- ❌ **Hardcode credential, secret, URL produksi, atau data user**.
- ❌ **Ubah konfigurasi CI/CD, environment, atau infra** tanpa diskusi.

---

## 5. Saat Menambah Fitur

- Baca panduan arsitektur project sebelum mulai.
- Tentukan layer sebelum menulis. Jangan taruh bisnis logika di route,
  controller, atau komponen presentasi.
- Jangan buat abstraksi untuk kebutuhan hipotetis. Tulis kode yang
  diminta sekarang (YAGNI — *You Aren't Gonna Need It*).
- Hormati batas ukuran file yang sudah disepakati di project. Kalau
  belum ada, gunakan rule of thumb: file >500 baris = sinyal untuk
  pisah; fungsi >50 baris = sinyal untuk extract.
- Ikuti konvensi naming, struktur folder, dan pattern yang sudah ada —
  konsistensi lebih penting dari preferensi pribadi.

---

## 6. Saat Ragu

Urutan tindakan:

1. Baca kode terkait lebih dalam.
2. Cek dokumen panduan project (`CLAUDE.md`, `README.md`, ADR, dll).
3. Cek git history (`git log -p`, `git blame`) kalau pertanyaannya soal
   "kenapa ini begini".
4. **Tanya user** — lebih baik tanya 1 pertanyaan daripada menulis 100
   baris yang harus dibuang.

Jangan pernah "pokoknya coba dulu, kalau salah revert". Revert itu murah
di local, tapi mahal kalau sudah merusak state (DB, session, file
sistem, deployment, dll).

---

## 7. Saat Selesai

- Jelaskan perubahan **secara singkat**: apa, di mana (file:line), kenapa.
- Sebutkan efek samping kalau ada (perubahan kontrak, breaking change,
  perlu migrasi, perlu restart service, dll).
- Jangan ringkas diff yang user sudah lihat — user baca kode langsung.
- Kalau project punya channel notifikasi atau workflow report
  (Slack/Discord/Telegram/email), kirim sesuai konvensi.

---

## 8. Eskalasi

Hentikan pekerjaan dan tanya user kalau:

- Fix butuh ubah >5 file untuk bug yang kelihatannya kecil.
- Ketemu bug lain di tengah jalan yang tidak diminta.
- Perubahan berpotensi mengenai data produksi, session aktif, atau
  user nyata.
- User memberi instruksi yang bertentangan dengan dokumen panduan
  project — konfirmasi dulu sebelum melanggar aturan.

---

## 9. Tools sebagai Mata dan Tangan AI

AI **wajib** memakai tools yang tersedia (MCP server, CLI commands,
debugger, browser automation, log inspector, DB query tool, dll) sebagai
**mata dan tangan**-nya.

- **Mata**: sebelum menebak state sistem, AI harus lihat langsung. Cek
  log, query DB read-only, baca file config, jalankan health check, atau
  pakai tool inspeksi yang relevan. Jangan berasumsi tentang data,
  konfigurasi, atau tampilan — **cek dulu**.
- **Tangan**: gunakan tools untuk verifikasi end-to-end setelah
  perubahan. Contoh: setelah fix UI, jalankan/preview halamannya dan
  pastikan render + console bersih. Setelah fix logic, jalankan test
  atau panggil endpoint yang relevan.
- **Maksimalkan pemakaian.** Kalau ada tool yang relevan, pakai — jangan
  memilih jalan manual yang lebih rapuh. Semakin sering tools dipakai
  untuk verifikasi, semakin solid project ini.
- **Ajukan tool baru kalau perlu.** Kalau AI merasa butuh tool yang
  belum ada, AI **boleh dan didorong** untuk mengajukan pembuatannya
  ke user. Format pengajuan:
  1. Nama tool + signature (input/output)
  2. Kenapa dibutuhkan (masalah konkret yang sedang dihadapi)
  3. Sumber data (tabel DB / cache key / endpoint / file system)
  4. Estimasi dampak ke kualitas investigasi/perbaikan
- **Jangan buat tool baru tanpa izin.** Ajukan dulu, tunggu persetujuan
  user, baru implementasi (+ update dokumentasi).
- **Tools adalah sumber kebenaran runtime.** Kalau memory/log mengatakan
  X tapi tool inspeksi langsung mengatakan Y, percayai tool.

Tujuan: AI tidak buta terhadap state sistem nyata, dan setiap perbaikan
diverifikasi secara nyata — bukan "harusnya sudah jalan".

---

## 10. Kontrak Public API / Interface (Wajib Dijaga)

Setiap interface yang dipakai oleh konsumen eksternal — REST/GraphQL
endpoint, MCP tool, library export, CLI command, webhook payload, event
schema, dll — adalah **kontrak publik**. Begitu konsumen (termasuk AI
agent dengan memory) tahu bentuk kontraknya, perubahan diam-diam bisa
bikin mereka bertindak berdasarkan asumsi yang sudah tidak valid — dan
kamu **tidak akan tahu** sampai terjadi kejadian aneh di prod.

### Apa yang dianggap kontrak (freeze)

| Kategori          | Contoh                                  | Aturan                                             |
| ----------------- | --------------------------------------- | -------------------------------------------------- |
| Nama interface    | endpoint path, tool name, function name | Tidak boleh rename tanpa bump versi                |
| Parameter input   | nama field, tipe, posisi                | Nama & tipe tidak boleh berubah                    |
| Required flag     | field wajib                             | Tidak boleh naik (optional → required) tanpa versi |
| Enum values       | nilai yang valid                        | Tidak boleh dihapus/diganti                        |
| Error mode        | format error response, exception type   | Pola error harus konsisten                         |
| Field output      | bentuk response                         | Tidak boleh dihapus/diganti tipenya                |

### Apa yang boleh berubah (additive)

- Tambah interface baru
- Tambah parameter **optional** baru
- Tambah field output baru (konsumen lama akan mengabaikan yang tidak
  mereka tahu, asal parsing-nya tolerant)
- Perbaiki pesan error (tanpa ubah polanya)
- Refactor implementasi internal (query, helper, dll)

### Cara kerja penjaga kontrak

1. **Contract test**: snapshot bentuk kontrak (nama, required,
   properties, enum) untuk setiap interface publik. Letakkan di folder
   khusus mis. `tests/contract/`.
2. **Kalau contract test merah karena perubahan yang disengaja**:
   1. Update dokumentasi kontrak
   2. Bump versi (semver, tag, atau version field)
   3. Update snapshot di contract test
   4. Jelaskan migrasinya di commit message + changelog
3. **Kalau contract test merah karena refactor yang tidak disengaja**:
   **Jangan update snapshot untuk menghijaukan test.** Balikkan refactor
   atau perbaiki supaya kontrak tetap sama. Snapshot bukan sampah yang
   bisa di-regenerate seenaknya — dia alarm kebakaran.

### Larangan spesifik

- ❌ **Jangan rename** interface publik tanpa migration plan + bump versi
- ❌ **Jangan hapus enum value** — konsumen bisa punya kode/memory yang
  memanggil nilai itu
- ❌ **Jangan naikkan param dari optional → required** tanpa bump versi
- ❌ **Jangan ubah bentuk error** (format response ↔ throw exception) —
  ini mengubah handler logic di sisi konsumen
- ❌ **Jangan update snapshot contract test** tanpa update dokumentasi

### Apa yang BUKAN tugas contract test

- Memverifikasi logika bisnis (itu unit test biasa)
- Memverifikasi integrasi DB/external service (itu integration test)
- Memastikan data yang di-return benar (itu QA / staging)

Contract test **hanya** menjaga bentuk kontrak — cepat, deterministic,
tanpa dependency eksternal.

---

## 11. Aturan Emas

> **Lebih baik tidak melakukan apa-apa daripada memperburuk kode.**
>
> Kalau setelah 2 kali percobaan fix masih memunculkan bug baru, **stop**.
> Laporkan ke user, jelaskan apa yang sudah dicoba dan kenapa gagal.
> Jangan tambal terus — itu cara bug beranak eksponensial.

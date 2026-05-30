# Setup SSH ke Ubuntu (proot) di Termux Android

Catatan langkah yang **berhasil** untuk SSH masuk ke environment Ubuntu yang
berjalan di dalam proot Termux, dan mendarat langsung sebagai user `makuro`.

## Environment

- Ubuntu (proot-distro) di dalam Termux di Android — bukan server/VM biasa.
- Seluruh rootfs dimiliki satu UID Android (`u0_a330`); proot hanya *memalsukan* root.
- Server produksi terpisah (`srv442857`) tidak terkait dengan ini.

---

## 1. Buat user `makuro` di dalam proot

`adduser` tidak ada di rootfs minimal, tapi `useradd` ada di `/usr/sbin` (sudah di PATH).

```bash
# sebagai root di dalam proot
useradd -m -s /bin/bash makuro
passwd makuro
id makuro            # verifikasi
```

## 2. Install package di dalam proot

`apt` bersifat **system-wide**, bukan per-user. Install sekali sebagai root,
otomatis tersedia untuk semua user termasuk makuro.

```bash
# sebagai root proot
apt update && apt install -y <package>
```

Catatan: di proot, model permission longgar — user non-root pun sering bisa
`apt update`. Tapi untuk `apt install`, tetap lakukan sebagai root supaya
maintainer script (postinst, dll.) tidak gagal.

---

## 3. JANGAN jalankan sshd di DALAM proot (dead-end)

Dicoba dan gagal — dicatat agar tidak diulang:

- Port 22 → bind ditolak. Port < 1024 butuh `CAP_NET_BIND_SERVICE`, dan kernel
  Android asli menilai dari UID Android sungguhan (non-root). Pakai port tinggi.
- Port 2222 (high port) → bind sukses, tapi koneksi `Connection reset`.
  Penyebab: privilege separation OpenSSH. Child preauth drop privilege ke user
  `sshd` lalu menguji apakah bisa mengembalikan gid lama. Di sistem nyata uji ini
  HARUS gagal; di proot perubahan uid/gid dipalsukan, jadi restore berhasil →
  sshd menganggap drop privilege tidak aman → child exit 255 → reset.
- Tidak bisa di-disable: di OpenSSH >= 7.5 privsep wajib (`UsePrivilegeSeparation no` dihapus).

Kesimpulan: OpenSSH sshd di dalam proot **fundamentally tidak kompatibel**.

---

## 4. Jalankan sshd NATIVE di Termux (cara yang berhasil)

Dijalankan di **shell Termux** (di luar proot), tidak kena masalah privsep.

```bash
# di Termux native
pkg install openssh
passwd                 # set password login SSH (atau pakai authorized_keys)
sshd                   # listening di port 8022
```

Test dari device lain di WiFi yang sama:

```bash
ssh u0_a330@192.168.1.55 -p 8022
```

Berhasil login ke shell Termux. (`u0_a330` = output `whoami` di Termux;
`192.168.1.55` = IP wlan0 dari `ifconfig`.)

---

## 5. Auto-masuk proot sebagai `makuro` saat SSH login

Tambahkan ke `~/.bashrc` Termux (kalau tidak ter-trigger, pindah ke `~/.profile`):

```bash
# Auto-masuk proot sebagai makuro hanya saat login via SSH
if [ -n "$SSH_CONNECTION" ] && [ -z "$PROOT_DONE" ]; then
    export PROOT_DONE=1
    exec proot-distro login ubuntu --user makuro
fi
```

- Ganti `ubuntu` dengan alias distro yang benar (`proot-distro list`).
- `$SSH_CONNECTION` → hanya jalan via SSH, bukan saat buka app Termux biasa.
- `exec` → logout dari proot otomatis menutup koneksi SSH dengan rapi.
- `PROOT_DONE` → cegah loop kalau `.bashrc` ter-source ulang.

Test: `ssh u0_a330@192.168.1.55 -p 8022` → harusnya langsung mendarat di
`makuro@localhost` (Ubuntu), bukan di Termux.

---

## 6. Persistensi (sshd hidup setelah reboot)

`sshd` tidak otomatis jalan lagi setelah Termux ditutup / HP reboot.

- Install add-on **Termux:Boot** (dari F-Droid).
- Taruh script start `sshd` di `~/.termux/boot/`.

---

## 7. (BELUM) Expose keluar via FRP

Langkah berikutnya yang belum dikerjakan:

- Forward port **8022** Termux lewat `frpc` ke FRP server (`wibudev.com`).
- `frpc` bisa dijalankan di Termux native.

---

## Ringkasan jaringan

| Interface | IP            | Keterangan                          |
|-----------|---------------|-------------------------------------|
| wlan0     | 192.168.1.55  | WiFi LAN — alamat untuk SSH lokal   |
| ccmni2    | 10.66.167.53  | Data seluler, di-NAT operator (butuh tunnel) |
| lo        | 127.0.0.1     | Loopback                            |

Port SSH: **8022** (Termux native sshd).

Berikut adalah cheat sheet untuk beberapa perintah utama dalam Docker CLI, lengkap dengan penjelasan, contoh penggunaan, keterangan opsi (flag), dan deskripsi singkat:

**Perintah: `docker run`**

Deskripsi: Menjalankan sebuah container dari sebuah image Docker.

Sintaks: `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

Opsi:
- `-d, --detach` - Menjalankan container di background dan mencetak ID kontainer.
- `-it, --interactive --tty` - Membuat terminal interaktif di dalam container.
- `-p, --publish list` - Meneruskan port dari host ke container.
- `-v, --volume list` - Mengaitkan volume antara host dan container.
- `--name string` - Memberikan nama pada container yang dijalankan.
- `--env list` - Menetapkan variabel lingkungan pada container.
- Lainnya - Dapat merujuk ke dokumentasi resmi Docker untuk opsi lebih lengkap.

Contoh penggunaan:
1. Menjalankan container secara interaktif:
   ```bash
   docker run -it ubuntu /bin/bash
   ```
   Keterangan: Menjalankan container dari image `ubuntu` dan membuka terminal interaktif di dalam container.

2. Menjalankan container di background dengan penerusan port:
   ```bash
   docker run -d -p 8080:80 my-app
   ```
   Keterangan: Menjalankan container dari image `my-app` di background dan meneruskan port 8080 pada host ke port 80 di dalam container.

**Perintah: `docker build`**

Deskripsi: Membangun sebuah image Docker dari Dockerfile.

Sintaks: `docker build [OPTIONS] PATH | URL | -`

Opsi:
- `-f, --file string` - Menentukan nama Dockerfile yang berbeda (default: `./Dockerfile`).
- `-t, --tag list` - Menandai image dengan nama dan tag.
- `--build-arg list` - Mengirimkan argumen build ke Dockerfile.
- `--target string` - Menentukan stage build yang akan dijalankan.
- Lainnya - Dapat merujuk ke dokumentasi resmi Docker untuk opsi lebih lengkap.

Contoh penggunaan:
1. Membangun image dengan Dockerfile default:
   ```bash
   docker build -t my-image:latest .
   ```
   Keterangan: Membaca Dockerfile di direktori saat ini (`.`) dan membangun image dengan nama `my-image` dan tag `latest`.

2. Menandai image dengan multiple tag:
   ```bash
   docker build -t my-image:v1 -t my-image:latest .
   ```
   Keterangan: Membaca Dockerfile di direktori saat ini dan membangun image dengan nama `my-image`, dengan dua tag yaitu `v1` dan `latest`.

**Perintah: `docker ps`**

Deskripsi: Menampilkan daftar container yang sedang berjalan.

Sintaks: `docker ps [OPTIONS]`

Opsi:
- `-a, --all` - Menampilkan semua container (termasuk yang sedang berhenti).
- `-q, --quiet` - Hanya menampilkan ID kontainer.

Contoh penggunaan:
1. Menampilkan daftar container yang sedang berjalan:
   ```bash
   docker ps
   ```
   Keterangan: Menampilkan daftar container yang sedang berjalan pada sistem.

2. Menampilkan daftar semua container (termasuk yang sedang berhenti):
   ```bash
   docker ps -a
   ```
   Keterangan: Menampilkan daftar semua container, termasuk yang sedang berjalan dan yang sedang berhenti.

**Perintah: `docker exec`**

Deskripsi: Menjalankan perintah di dalam container yang sedang berjalan.

Sintaks: `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`

Opsi:
- `-d, --detach` - Menjalankan perintah di background.
- `-it, --interactive --tty` - Membuat terminal interaktif di dalam container.
- Lainnya - Dapat merujuk ke dokumentasi resmi Docker untuk opsi lebih lengkap.

Contoh penggunaan:
1. Menjalankan perintah `ls` di dalam container yang sedang berjalan:
   ```bash
   docker exec my-container ls /app
   ```
   Keterangan: Menjalankan perintah `ls /app` di dalam container dengan nama `my-container`.

2. Menjalankan perintah di dalam container dan mengaktifkan mode interaktif:
   ```bash
   docker exec -it my-container /bin/bash
   ```
   Keterangan: Membuka terminal interaktif di dalam container dengan nama `my-container`.

**Perintah: `docker volume`**

Deskripsi: Mengelola volume Docker.

Sintaks: `docker volume [OPTIONS] COMMAND [ARG...]`

Opsi:
- `ls` - Menampilkan daftar volume yang ada.
- `create` - Membuat volume baru.
- `inspect` - Menampilkan informasi detail tentang volume.
- `rm` - Menghapus volume.
- Lainnya - Dapat merujuk ke dokumentasi resmi Docker untuk opsi lebih lengkap.

Contoh penggunaan:
1. Menampilkan daftar volume yang ada:
   ```bash
   docker volume ls
   ```
   Keterangan

: Menampilkan daftar volume yang ada pada sistem Docker.

2. Membuat volume baru:
   ```bash
   docker volume create my-volume
   ```
   Keterangan: Membuat sebuah volume baru dengan nama `my-volume`.

3. Menampilkan informasi detail tentang volume:
   ```bash
   docker volume inspect my-volume
   ```
   Keterangan: Menampilkan informasi detail tentang volume dengan nama `my-volume`.

4. Menghapus volume:
   ```bash
   docker volume rm my-volume
   ```
   Keterangan: Menghapus volume dengan nama `my-volume`.

Penting untuk merujuk ke dokumentasi resmi Docker untuk informasi lebih lanjut tentang setiap perintah, opsi, dan contoh penggunaan yang lebih lengkap.

Berikut adalah cheat sheet untuk perintah `docker build`, lengkap dengan penjelasan dan contoh penggunaannya:

Perintah: `docker build`
Deskripsi: Membangun sebuah image Docker dari Dockerfile.
Sintaks: `docker build [OPTIONS] PATH | URL | -`
Opsi:
- `-f, --file string`  Menentukan nama Dockerfile yang berbeda (default: `./Dockerfile`).
- `-t, --tag list`  Menandai image dengan nama dan tag.
- `--build-arg list`  Mengirimkan argumen build ke Dockerfile.
- `--target string`  Menentukan stage build yang akan dijalankan.
Contoh:
1. Membangun image dengan Dockerfile default:
   ```bash
   docker build -t my-image:latest .
   ```
   Penjelasan: Perintah ini akan membaca Dockerfile yang ada di direktori saat ini (`.`), dan membangun sebuah image baru dengan nama `my-image` dan tag `latest`.

2. Membangun image dengan Dockerfile dari lokasi yang ditentukan:
   ```bash
   docker build -t my-image:v1 /path/to/dockerfile/dir
   ```
   Penjelasan: Perintah ini akan membaca Dockerfile yang ada di direktori `/path/to/dockerfile/dir`, dan membangun sebuah image baru dengan nama `my-image` dan tag `v1`.

3. Menandai image dengan multiple tag:
   ```bash
   docker build -t my-image:v1 -t my-image:latest .
   ```
   Penjelasan: Perintah ini akan membaca Dockerfile yang ada di direktori saat ini, dan membangun sebuah image baru dengan nama `my-image`, dengan dua tag yaitu `v1` dan `latest`.

4. Mengirimkan argumen build ke Dockerfile:
   ```bash
   docker build --build-arg ENVIRONMENT=production -t my-image:prod .
   ```
   Penjelasan: Perintah ini akan membaca Dockerfile yang ada di direktori saat ini, dan membangun sebuah image baru dengan nama `my-image` dan tag `prod`, sambil mengirimkan argumen `ENVIRONMENT=production` ke dalam proses build.

5. Menentukan stage build yang akan dijalankan:
   ```bash
   docker build --target dev-stage -t my-image:dev .
   ```
   Penjelasan: Perintah ini akan membaca Dockerfile yang ada di direktori saat ini, dan membangun sebuah image baru dengan nama `my-image` dan tag `dev`, hanya menjalankan stage build yang bernama `dev-stage`.

Perintah `docker build` digunakan untuk membaca Dockerfile dan membangun sebuah image Docker. Dalam Dockerfile, Anda dapat mendefinisikan langkah-langkah untuk mengkonfigurasi dan mengatur lingkungan container. Dengan menggunakan perintah ini, Anda dapat mengontrol proses pembangunan image Docker secara fleksibel dan menghasilkan image yang siap digunakan untuk menjalankan container.

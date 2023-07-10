Berikut adalah cheat sheet untuk perintah `docker run`, lengkap dengan penjelasan dan contoh penggunaannya:

Perintah: `docker run`
Deskripsi: Menjalankan sebuah container dari sebuah image Docker.
Sintaks: `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
Opsi:
- `-d, --detach`  Menjalankan container di background dan mencetak ID kontainer.
- `-it, --interactive --tty`  Membuat terminal interaktif di dalam container.
- `-p, --publish list`  Meneruskan port dari host ke container.
- `-v, --volume list`  Mengaitkan volume antara host dan container.
- `--name string`  Memberikan nama pada container yang dijalankan.
- `--env list`  Menetapkan variabel lingkungan pada container.
Contoh:
1. Menjalankan container secara interaktif:
   ```bash
   docker run -it ubuntu /bin/bash
   ```
   Penjelasan: Perintah ini akan menjalankan container dari image `ubuntu` dan membuka terminal interaktif di dalam container.

2. Menjalankan container di background dan meneruskan port:
   ```bash
   docker run -d -p 8080:80 my-app
   ```
   Penjelasan: Perintah ini akan menjalankan container dari image `my-app` di background, dan meneruskan port 8080 pada host ke port 80 di dalam container.

3. Mengaitkan volume antara host dan container:
   ```bash
   docker run -v /path/to/host:/path/to/container my-app
   ```
   Penjelasan: Perintah ini akan menjalankan container dari image `my-app` dan mengaitkan volume antara `/path/to/host` pada host dengan `/path/to/container` di dalam container.

4. Memberikan nama pada container yang dijalankan:
   ```bash
   docker run --name my-container my-app
   ```
   Penjelasan: Perintah ini akan menjalankan container dari image `my-app` dan memberikan nama `my-container` pada container yang dijalankan.

5. Menetapkan variabel lingkungan pada container:
   ```bash
   docker run --env DATABASE_HOST=example.com --env DATABASE_PORT=5432 my-app
   ```
   Penjelasan: Perintah ini akan menjalankan container dari image `my-app` dan menetapkan variabel lingkungan `DATABASE_HOST` dan `DATABASE_PORT` di dalam container.

Perintah `docker run` digunakan untuk menjalankan sebuah container dari sebuah image Docker. Anda dapat menggunakan opsi tambahan untuk mengatur berbagai aspek dari container yang dijalankan, seperti interaksi dengan container, penerusan port, pengaitan volume, memberikan nama pada container, dan menetapkan variabel lingkungan.

Dengan menggunakan perintah ini, Anda dapat dengan mudah menjalankan container Docker dan mengatur pengaturan yang diperlukan sesuai kebutuhan aplikasi atau layanan yang akan dijalankan di dalam container.

Berikut adalah contoh lengkap untuk menjalankan container PostgreSQL dengan menggunakan perintah `docker run`:

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v /my/host/path:/var/lib/postgresql/data \
  postgres:latest
```

Penjelasan rinci untuk setiap argumen perintah:

- `-d`: Menjalankan kontainer dalam mode detasemen (background).
- `--name my-postgres`: Memberikan nama "my-postgres" kepada kontainer.
- `-e POSTGRES_PASSWORD=mysecretpassword`: Mengatur variabel lingkungan (environment variable) `POSTGRES_PASSWORD` dengan nilai "mysecretpassword". Ini adalah kata sandi yang akan digunakan untuk mengakses database PostgreSQL.
- `-p 5432:5432`: Memetakan port 5432 pada host ke port 5432 di dalam kontainer. Port 5432 adalah port default untuk koneksi PostgreSQL.
- `-v /my/host/path:/var/lib/postgresql/data`: Memetakan direktori pada host ke direktori `/var/lib/postgresql/data` di dalam kontainer. Hal ini memungkinkan untuk menyimpan data database di host untuk persistensi.
- `postgres:latest`: Menentukan nama dan versi image Docker yang akan digunakan untuk menjalankan kontainer. Dalam contoh ini, menggunakan image PostgreSQL dengan tag `latest`.

Setelah menjalankan perintah di atas, Docker akan membuat dan menjalankan kontainer PostgreSQL dengan konfigurasi yang ditentukan. Anda dapat mengakses database PostgreSQL melalui `localhost:5432` pada host, dengan menggunakan klien PostgreSQL seperti `psql` atau alat administrasi database.

Pastikan untuk mengganti `/my/host/path` dengan jalur yang valid pada host Anda, sesuai dengan kebutuhan Anda.

Perhatikan bahwa contoh ini menggunakan tag `latest` untuk image PostgreSQL, tetapi Anda juga dapat menggunakan versi spesifik sesuai kebutuhan Anda.

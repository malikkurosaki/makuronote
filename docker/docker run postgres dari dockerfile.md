Berikut ini adalah tutorial lengkap tentang bagaimana menjalankan PostgreSQL menggunakan Docker, mulai dari membuat Dockerfile hingga eksekusi dan penempatannya dalam proyek yang nyata.

Langkah 1: Buat Dockerfile
1. Buatlah direktori baru untuk proyek Docker PostgreSQL Anda.
2. Di dalam direktori tersebut, buat file bernama `Dockerfile` (tanpa ekstensi) dengan teks editor pilihan Anda.

Dockerfile adalah file teks yang berisi instruksi untuk membangun image Docker. Berikut adalah contoh isi Dockerfile untuk PostgreSQL:

```Dockerfile
# Gunakan image PostgreSQL resmi dari Docker Hub
FROM postgres:latest

# Variabel lingkungan untuk mengatur kata sandi PostgreSQL
ENV POSTGRES_PASSWORD mysecretpassword

# Salin file SQL ke dalam kontainer dan eksekusi
COPY init.sql /docker-entrypoint-initdb.d/
```

Pada contoh di atas:
- `FROM postgres:latest` mengambil image resmi PostgreSQL dari Docker Hub.
- `ENV POSTGRES_PASSWORD mysecretpassword` mengatur variabel lingkungan `POSTGRES_PASSWORD` dengan kata sandi yang ingin Anda gunakan untuk database.
- `COPY init.sql /docker-entrypoint-initdb.d/` menyalin file `init.sql` (yang akan kita buat nanti) ke dalam direktori `/docker-entrypoint-initdb.d/` di dalam kontainer. File SQL ini akan dieksekusi saat kontainer PostgreSQL pertama kali berjalan.

Langkah 2: Buat File SQL
1. Di dalam direktori yang sama dengan Dockerfile, buat file bernama `init.sql` dengan teks editor Anda.
2. Isi file `init.sql` dengan perintah SQL yang ingin Anda jalankan saat kontainer PostgreSQL pertama kali berjalan. Misalnya:

```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO customers (name, email) VALUES ('John Doe', 'john@example.com');
```

Langkah 3: Build dan Jalankan Docker Image
1. Buka terminal atau command prompt dan navigasikan ke direktori proyek Docker PostgreSQL Anda.
2. Jalankan perintah berikut untuk membangun image Docker dari Dockerfile:

```bash
docker build -t my-postgres .
```

Perintah ini akan membaca Dockerfile di direktori saat ini (`.`) dan membangun image dengan nama `my-postgres`.

3. Setelah proses pembangunan selesai, jalankan perintah berikut untuk menjalankan kontainer PostgreSQL:

```bash
docker run -d -p 5432:5432 --name my-postgres-container my-postgres
```

- `-d` menjalankan kontainer dalam mode detasemen (background).
- `-p 5432:5432` memetakan port 5432 di host ke port 5432 di dalam kontainer. Ini memungkinkan akses ke database PostgreSQL melalui `localhost:5432` pada host.
- `--name my-postgres-container` memberikan nama `my-postgres-container` kepada kontainer.
- `my-postgres` adalah nama image yang telah kita bangun sebelumnya.

4. Kontainer PostgreSQL sekarang berjalan dan dapat diakses melalui `localhost:5432` menggunakan klien PostgreSQL, seperti `psql`.

Langkah 4: Menggunakan Kontainer PostgreSQL dalam Proyek
Setelah kontainer PostgreSQL berjalan, Anda dapat menggunakannya dalam proyek Anda dengan cara berikut:

- Menghubungkan proyek Anda ke kontainer PostgreSQL dengan menggunakan alamat IP dan port yang sesuai.
- Menggunakan klien PostgreSQL, seperti `psql`, untuk terhubung ke kontainer dan mengelola database.

Pastikan untuk menggunakan parameter yang sesuai saat terhubung ke kontainer, seperti nama pengguna dan kata sandi PostgreSQL.

Itulah tutorial lengkap tentang bagaimana menjalankan PostgreSQL menggunakan Docker, dari membuat Dockerfile hingga eksekusi dan penempatannya dalam proyek yang nyata. Anda dapat mengadaptasinya sesuai dengan kebutuhan spesifik proyek Anda.

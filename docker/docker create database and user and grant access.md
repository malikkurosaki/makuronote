Untuk membuat database baru, user baru, dan memberikan akses kepada user baru pada schema public di PostgreSQL, Anda dapat mengikuti langkah-langkah berikut:

1. Terhubung ke container PostgreSQL yang sedang berjalan menggunakan klien PostgreSQL, seperti `psql`:
   ```bash
   docker exec -it my-postgres-container psql -U postgres
   ```
   Gantilah `my-postgres-container` dengan nama kontainer PostgreSQL yang sedang berjalan. Jika Anda menggunakan kata sandi yang berbeda untuk pengguna `postgres`, Anda perlu menambahkan opsi `-W` dan memasukkan kata sandi saat diminta.

2. Setelah terhubung ke klien PostgreSQL, buat database baru:
   ```sql
   CREATE DATABASE nama_database;
   ```
   Gantilah `nama_database` dengan nama database baru yang ingin Anda buat.

3. Buat user baru:
   ```sql
   CREATE USER nama_user WITH ENCRYPTED PASSWORD 'kata_sandi';
   ```
   Gantilah `nama_user` dengan nama user baru yang ingin Anda buat, dan `kata_sandi` dengan kata sandi yang ingin Anda gunakan untuk user tersebut.

4. Berikan akses untuk user baru pada schema public:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE nama_database TO nama_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nama_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO nama_user;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO nama_user;
   ```
   Gantilah `nama_database` dengan nama database yang telah Anda buat, dan `nama_user` dengan nama user baru yang telah Anda buat.

   Perintah di atas memberikan hak akses penuh kepada user baru pada database dan schema public, serta memberikan hak akses untuk menggunakan dan melihat urutan (sequences) di schema public.

Setelah Anda menjalankan perintah-perintah di atas, database baru dan user baru akan dibuat, dan user baru akan memiliki akses penuh pada schema public. Anda dapat mengganti perintah-perintah di atas sesuai dengan kebutuhan khusus Anda, seperti memberikan akses yang lebih terbatas atau menyesuaikan hak akses pada objek lain di dalam database.

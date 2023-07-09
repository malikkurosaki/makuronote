Berikut adalah cheat sheet lengkap untuk PostgreSQL dengan contoh-contoh dan penjelasan:

## Mengelola Database

- Membuat database:
  ```bash
  CREATE DATABASE nama_database;
  ```

  Contoh:
  ```bash
  CREATE DATABASE mydatabase;
  ```

- Menghapus database:
  ```bash
  DROP DATABASE nama_database;
  ```

  Contoh:
  ```bash
  DROP DATABASE mydatabase;
  ```

- Menggunakan database:
  ```bash
  \c nama_database;
  ```

  Contoh:
  ```bash
  \c mydatabase;
  ```

- Menampilkan daftar database:
  ```bash
  \l
  ```

## Mengelola Tabel

- Membuat tabel:
  ```bash
  CREATE TABLE nama_tabel (
    kolom1 tipe_data1,
    kolom2 tipe_data2,
    ...
  );
  ```

  Contoh:
  ```bash
  CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  );
  ```

- Menampilkan struktur tabel:
  ```bash
  \d nama_tabel
  ```

  Contoh:
  ```bash
  \d customers
  ```

- Menghapus tabel:
  ```bash
  DROP TABLE nama_tabel;
  ```

  Contoh:
  ```bash
  DROP TABLE customers;
  ```

- Menambahkan data ke tabel:
  ```bash
  INSERT INTO nama_tabel (kolom1, kolom2, ...) VALUES (nilai1, nilai2, ...);
  ```

  Contoh:
  ```bash
  INSERT INTO customers (name, email) VALUES ('John Doe', 'john@example.com');
  ```

- Menampilkan data dari tabel:
  ```bash
  SELECT * FROM nama_tabel;
  ```

  Contoh:
  ```bash
  SELECT * FROM customers;
  ```

- Memperbarui data di dalam tabel:
  ```bash
  UPDATE nama_tabel SET kolom = nilai WHERE kondisi;
  ```

  Contoh:
  ```bash
  UPDATE customers SET email = 'john.doe@example.com' WHERE id = 1;
  ```

- Menghapus data dari tabel:
  ```bash
  DELETE FROM nama_tabel WHERE kondisi;
  ```

  Contoh:
  ```bash
  DELETE FROM customers WHERE id = 1;
  ```

## Operasi Lainnya

- Menampilkan versi PostgreSQL:
  ```bash
  SELECT version();
  ```

- Menampilkan daftar pengguna (users):
  ```bash
  \du
  ```

- Menampilkan informasi tentang indeks pada tabel:
  ```bash
  \di nama_tabel
  ```

  Contoh:
  ```bash
  \di customers
  ```

- Menampilkan daftar indeks di database:
  ```bash
  \di
  ```

Ini adalah beberapa contoh perintah dan operasi umum untuk PostgreSQL. PostgreSQL memiliki banyak fitur dan perintah yang dapat digunakan untuk mengelola database secara lebih rinci. Untuk informasi lebih lanjut, Anda dapat merujuk ke dokumentasi resmi PostgreSQL atau menggunakan perintah `\h` di dalam CLI PostgreSQL untuk melihat bantuan yang tersedia.

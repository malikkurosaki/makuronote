Berikut adalah tutorial lengkap untuk menjalankan container Debian, mengekspos port, dan mengaksesnya melalui SSH:

Langkah 1: Menjalankan Container Debian
1. Buka terminal atau command prompt dan jalankan perintah berikut untuk menjalankan container Debian:
   ```bash
   docker run -d --name my-debian debian:latest
   ```
   Perintah ini akan menjalankan container Debian dengan nama `my-debian` menggunakan image Debian terbaru dari Docker Hub.

2. Periksa apakah container berjalan dengan baik:
   ```bash
   docker ps
   ```
   Anda akan melihat daftar kontainer yang sedang berjalan, termasuk `my-debian`.

Langkah 2: Mengekspos Port
1. Untuk mengekspos port pada container Debian, tambahkan opsi `-p` saat menjalankan perintah `docker run`. Misalnya, untuk mengekspos port 22 untuk SSH, jalankan perintah berikut:
   ```bash
   docker run -d -p 2222:22 --name my-debian debian:latest
   ```
   Dalam contoh ini, port 2222 pada host akan diarahkan ke port 22 pada container Debian.

2. Sekarang, Anda dapat mengakses container Debian melalui SSH menggunakan port yang telah diekspos. 

Langkah 3: Mengakses Container melalui SSH
1. Pastikan Anda memiliki klien SSH terinstal di sistem operasi host Anda. Jika tidak, instal klien SSH yang sesuai untuk sistem operasi Anda.

2. Buka terminal atau command prompt dan gunakan perintah berikut untuk terhubung ke container Debian melalui SSH:
   ```bash
   ssh -p 2222 root@localhost
   ```
   Gantilah `2222` dengan nomor port yang telah Anda tentukan saat mengekspos port. Jika Anda menggunakan kontainer Debian tanpa mengekspos port, Anda masih dapat menggunakan perintah ini dengan mengganti `-p 2222` menjadi `-p port_host:22`, di mana `port_host` adalah port yang ingin Anda gunakan pada host.

3. Ketika diminta, masukkan kata sandi untuk pengguna root dalam kontainer Debian. Secara default, kata sandi root pada kontainer Debian adalah kosong.

Setelah Anda berhasil terhubung melalui SSH, Anda dapat menjelajahi dan mengelola kontainer Debian seperti halnya dengan mesin fisik Debian.

Pastikan untuk memperhatikan langkah-langkah keamanan yang disarankan saat menggunakan SSH, seperti memastikan kata sandi yang kuat atau menggunakan kunci SSH untuk otentikasi yang lebih aman.

Dengan tutorial ini, Anda dapat menjalankan container Debian, mengekspos port, dan mengaksesnya melalui SSH untuk mengelola kontainer dengan lebih mudah.

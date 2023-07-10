Berikut ini adalah cheat sheet untuk perintah `docker commit`, beserta penjelasan dan contoh penggunaannya:

Perintah: `docker commit`
Deskripsi: Membuat sebuah image baru dari container yang sedang berjalan.
Sintaks: `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`
Opsi:
- `-a, --author string`  Menambahkan informasi author ke image.
- `-c, --change string`  Menambahkan instruksi Dockerfile custom ke image.
- `-m, --message string`  Menambahkan pesan komit ke image.
Contoh:
1. Membuat image baru dari container yang sedang berjalan:
   ```bash
   docker commit my-container my-image:v1
   ```
   Penjelasan: Perintah ini akan membuat sebuah image baru dengan nama `my-image` dan tag `v1` berdasarkan state terakhir dari container `my-container`.

2. Menambahkan informasi author dan pesan komit:
   ```bash
   docker commit -a "John Doe" -m "Added new feature" my-container my-image:v2
   ```
   Penjelasan: Perintah ini akan membuat image baru dengan nama `my-image` dan tag `v2`, serta menambahkan informasi author "John Doe" dan pesan komit "Added new feature" ke image tersebut.

3. Menambahkan instruksi Dockerfile custom:
   ```bash
   docker commit -c 'RUN apt-get install -y curl' my-container my-image:v3
   ```
   Penjelasan: Perintah ini akan membuat image baru dengan nama `my-image` dan tag `v3`, serta menambahkan instruksi khusus ke image tersebut untuk menjalankan perintah `apt-get install -y curl` saat image digunakan untuk menjalankan container.

Penting untuk diingat bahwa menggunakan perintah `docker commit` untuk membuat image baru dari container yang sedang berjalan hanya sebaiknya dilakukan dalam situasi tertentu, seperti ketika Anda ingin membuat snapshot cepat dari container atau melakukan eksperimen. Untuk keperluan pengembangan yang lebih serius, disarankan untuk menggunakan file Dockerfile dan perintah `docker build` untuk membuat image secara terstruktur.

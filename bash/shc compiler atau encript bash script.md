Berikut ini adalah cheat sheet yang memberikan contoh penggunaan flag dan opsi yang umum digunakan dengan shc (Shell Script Compiler):

```
shc [flag] [option] [script_file]
```

Flag:
- `-e`: Enkripsi skrip dengan password yang diberikan.
- `-m`: Set mode enkripsi. Opsi yang tersedia: `0` (enkripsi standar), `1` (enkripsi dengan kompresi gzip), `2` (enkripsi dengan kompresi bzip2), `3` (enkripsi dengan kompresi tar).
- `-r`: Hilangkan opsi `-x` (self-extract) dari file terkompilasi.
- `-v`: Tampilkan versi shc yang sedang digunakan.
- `-h`: Tampilkan bantuan tentang penggunaan shc.

Option:
- `-f [output_file]`: Tentukan nama file keluaran yang akan digunakan untuk file terkompilasi. Jika tidak ditentukan, nama file akan sama dengan nama file skrip asli dengan ekstensi `.x`.
- `-o [object_file]`: Tentukan nama file objek yang akan digunakan. Jika tidak ditentukan, nama file objek akan sama dengan nama file skrip asli dengan ekstensi `.o`.
- `-n`: Jangan menghapus file objek yang dihasilkan setelah proses kompilasi selesai.
- `-U [string]`: Tentukan string yang akan didefinisikan sebagai makro praprosesor.
- `-D [macro]`: Tentukan makro praprosesor yang akan didefinisikan.

Contoh Penggunaan:
1. Enkripsi skrip dengan password:
```
shc -e 123456 script.sh
```
Ini akan mengenkripsi skrip Bash `script.sh` dengan password `123456` dan menghasilkan file terkompilasi `script.sh.x`.

2. Enkripsi skrip dengan kompresi gzip:
```
shc -m 1 script.sh
```
Ini akan mengenkripsi dan mengkompresi skrip Bash `script.sh` menggunakan kompresi gzip, dan menghasilkan file terkompilasi `script.sh.x`.

3. Enkripsi skrip dan tentukan nama file keluaran:
```
shc -e -f compiled_script script.sh
```
Ini akan mengenkripsi skrip Bash `script.sh` dan menghasilkan file terkompilasi dengan nama `compiled_script`.

4. Menjalankan file terkompilasi:
```
./script.sh.x
```
Ini akan menjalankan file terkompilasi `script.sh.x` yang dihasilkan dari proses kompilasi.

Perhatikan bahwa contoh-contoh ini hanya memberikan gambaran umum tentang penggunaan shc. Harap merujuk ke dokumentasi resmi shc untuk informasi lebih lanjut tentang penggunaan dan opsi yang tersedia.

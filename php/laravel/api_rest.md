# api rest

```php

@host http://localhost:8000

### lihat customer
GET http://localhost:8000/api/lihat-customer HTTP/1.1

### tambah customer
POST http://localhost:8000/api/tambah-customer HTTP/1.1
Content-Type: application/json

{
    "id":"kjnhgfdxctyvbynj7654456",
    "nama": "malik",
    "alamat": "denpasar",
    "telpon": "081",
    "negara": "indonesia",
    "email": "gmail"
}

### update customer
POST http://localhost:8000/api/update-customer HTTP/1.1
Content-Type: application/json

{
    "id": "1",
    "nama": "malikku",
    "alamat": "denpasara",
    "telpon": "081t",
    "negara": "indonesia",
    "email": "gmail"
}

### hapus customer
POST http://localhost:8000/api/hapus-customer/1 HTTP/1.1


### PRODUCT

### - lihat product
GET http://localhost:8000/api/lihat-product HTTP/1.1

### - tambah product

POST http://localhost:8000/api/tambah-product HTTP/1.1
Content-Type: application/json

{
    "nama": "topi",
    "harga": "5000",
    "satuan": "cm",
    "size": "50",
    "warna": "merah",
    "sablon": "ya"
}


### WARNA ###

### - WARNA
GET http://localhost:8000/api/warna HTTP/1.1

### - lihat warna
GET http://localhost:8000/api/lihat-warna

### - tambah warna
POST http://localhost:8000/api/tambah-warna HTTP/1.1
Content-Type: application/json

{
    "nama": "putih",
    "kode_warna": "#ffffff"
}

### UKURAN ###

### - lihat ukuran
GET http://localhost:8000/api/lihat-ukuran HTTP/1.1

### - Tambah Size
POST http://localhost:8000/api/tambah-ukuran HTTP/1.1
Content-Type: application/json

{
    "nama": "centi meter",
    "satuan": "cm"
}


### PEGAWAI

### - lihat pegawai
GET  http://localhost:8000/api/lihat-pegawai HTTP/1.1

### TAMBAH PEGAWAI
POST http://localhost:8000/api/tambah-pegawai HTTP/1.1
Content-Type: application/json

{
    "nama": "malik e",
    "email": "gmail",
    "pass": "pass",
    "jabatan": "jabatan"
}

### JENIS

### - lihat jenis
GET  http://localhost:8000/api/lihat-jenis HTTP/1.1

### - tambah jenis
POST http://localhost:8000/api/tambah-jenis HTTP/1.1
Content-Type: application/json

{
    "nama": "katun",
    "kode_jenis": "combet 30"
}

### - PRODUCTION
### - lihat production
GET http://localhost:8000/api/production HTTP/1.1

### lihat production
get http://localhost:8000/api/lihat-production HTTP/1.1

### lihat id
get http://localhost:8000/api/lihat/10 HTTP/1.1

### tambah production
POST http://localhost:8000/api/tambah-production HTTP/1.1
Content-Type: application/json

{
    "id_cus": "xsasa",
    "nama_cus": "sasa",
    "negara": "asas",
    "telpon": "sas",
    "tanggal": "sas",
    "sales": "sas",
    "product": "asas",
    "jenis": "sa",
    "warna": "sa",
    "size": "sa",
    "sablon": "sas",
    "satuan": "sa",
    "harga": "sa",
    "total": "sa"
}

### - hapus produksi
POST http://localhost:8000/api/hapus-production/1 HTTP/1.1

### clear
GET https://probusmail.000webhostapp.com/api/clear HTTP/1.1


### update production
POST http://localhost:8000/api/update-production HTTP/1.1
Content-Type: application/json

{
    "id": 23,
    "id_cus": "4e21d670-2d5f-4454-9332-c43386d0f3a4",
    "nama_cus": "agsus",
    "negara": "indonsaia",
    "telpon": "091",
    "tanggal": "2020-08-19",
    "sales": "malik e",
    "product": "topi",
    "jenis": "katun",
    "warna": "putih",
    "size": "centi meter",
    "sablon": "iya",
    "satuan": "lusin",
    "harga": "5000",
    "total": "10",
    "created_at": "2020-08-22T14:51:06.000000Z",
    "updated_at": "2020-08-22T14:51:06.000000Z",
    "status": true
  }
  
  ```

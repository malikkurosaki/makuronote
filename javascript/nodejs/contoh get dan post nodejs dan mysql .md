# contoh node js

```javascript
const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')
var nodemailer = require('nodemailer');

const db = mysql.createConnection({
    host:"localhost",
    user:"makuro",
    password:"Makuro_123",
    database:"malik_data"
  })
  

  db.connect((err)=>{
    if(err) throw err
  })
  process.on('uncaughtException',(err)=>{
    if(err){
      console.log(err)
    }
  })
  
  const app = express();
  app.use(parser.json())
  app.use(parser.urlencoded({extended:true}))
  app.use(cors({credentials: true, origin: true}))

  const tabelPegawai = {
      id:"id",
      nik:"nik",
      mulai:"mulai",
      jabatan:"jabatan",
      status:"status",
      lama:"lama",
      periode:"periode",
      nama_tabel:"pegawai"
  }

  const tabelGajiTunai = {
      id:"id",
      nik:"nik",
      pokok:"pokok",
      jabatan:"jabatan",
      kehadiran:"kehadiran",
      sembako:"sembako",
      housing:"housing",
      luar_kota:"luar_kota",
      marketing:"marketing",
      bonus_lainnya:"bonus_lainnya",
      kacamata:"kacamata",
      suka_duka:"suka_duka",
      hari_raya:"hari_raya",
      pendidikan_anak:"pendidikan_anak",
      bpjs:"bpjs",
      asuransi_kesehatan:"asuransi_kesehatan",
      riset:"riset",
      nama_tabel:"gaji_tunai"
  } 

  const tabelGajiNonTunai = {
      id:"id",
      nik:"nik",
      komunikasi:"komunikasi",
      kesehatan:"kesehatan",
      bpjs:"bpjs",
      nama_tabel:"non_tunai"
  }

  const tabelPotongan = {
      id:"id",
      nik:"nik",
      angsuran_koperasi:"angsuran_koperasi",
      pendidikan_anak:"pendidikan_anak",
      bpjs_jht:"bpjs_jht",
      iuran_koperasi:"iuran_koperasi",
      lainnya:"lainnya",
      zakat:"zakat",
      nama_tabel:"potongan"
  }

  var tabel = "malik_data"

  app.get('/hapustabel',(a,b)=>{
    let sql = `
      drop table if exists ${tabelPegawai.nama_tabel}
    `
    let query = db.query(sql,(c,d)=>{
        if(c) b.send([{"status":"error"},{"keterangan":c}])
        else b.send([{"status":"berhasil"}])
    })
  })

  app.get('/buat_tabel_pegawai',(a,b)=>{
    let sql = `create table if not exists ${tabelPegawai.nama_tabel}
    (
        ${tabelPegawai.id} int auto_increment,
        ${tabelPegawai.nik} varchar(255) not null,
        ${tabelPegawai.mulai} varchar(255) default '',
        ${tabelPegawai.jabatan} varchar(255) default '',
        ${tabelPegawai.status} varchar(255) default '',
        ${tabelPegawai.periode} varchar(255) default '',
        ${tabelPegawai.lama} varchar(255) default '',
        primary key (${tabelPegawai.id},${tabelPegawai.nik})
        )`
    let query = db.query(sql,(c,d)=>{
        if(c){
            b.send([{"status":"error"},{"keterangan":c}])
        }else{
            b.send([{"status":"berhasil","keterangan":"ok"}])
        }
    })
  })

  app.get("/buat_tabel_tunai",(a,b)=>{
    let sql = `create table if not exists ${tabelGajiTunai.nama_tabel} (
      ${tabelGajiTunai.nik} varchar(255) not null,
      ${tabelGajiTunai.asuransi_kesehatan} varchar(255) not null default '',
      ${tabelGajiTunai.bonus_lainnya} varchar(255) not null default '',
      ${tabelGajiTunai.bpjs} varchar(255) not null default '',
      ${tabelGajiTunai.hari_raya} varchar(255) not null default '',
      ${tabelGajiTunai.housing} varchar (255) not null default '',
      ${tabelGajiTunai.jabatan} varchar (255) not null default '',
      ${tabelGajiTunai.kacamata} varchar (255) not null default '',
      ${tabelGajiTunai.kehadiran} varchar (255) not null default '',
      ${tabelGajiTunai.luar_kota} varchar (255) not null default '',
      ${tabelGajiTunai.marketing} varchar (255) not null default '',
      primary key(${tabelGajiTunai.nik})
    )`

    let query = db.query(sql,(c,d)=>{
        if(c) {
          b.send(`[{"status":"gagal","kterangan":${c.message}}]`)
        }else{
          b.send(`[{"status":"berhasil","keterangan":"ok"}]`)
        }
    })
  })

  app.get("/buat_table_potongan",(a,b)=>{
    let sql = `create table ${tabelPotongan.nama_tabel}(
      ${tabelPotongan.nik} varchar (255) not null,
      ${tabelPotongan.angsuran_koperasi} varchar (255) not null default '',
      ${tabelPotongan.bpjs_jht} varchar (255) not null default '',
      ${tabelPotongan.iuran_koperasi} varchar (255) not null default '',
      ${tabelPotongan.lainnya} varchar (255) not null default '',
      ${tabelPotongan.pendidikan_anak} varchar (255) not null default '',
      ${tabelPotongan.zakat} varchar (255) not null default '',
      primary key (${tabelPotongan.nik})
    )`

    let query = db.query(sql,(c,d)=>{
      if(c){
        b.send([{"status":"gagal","keterangan":c.message}])
      }else{
        b.send([{"status":"berhasil","keterangan":"ok"}])
      }
    })
  })
  
  app.get("/buat_tabel_non_tunai",(a,b)=>{
    let sql = `create table if not exists ${tabelGajiNonTunai.nama_tabel}(
      ${tabelGajiNonTunai.nik} varchar (255) not null default '' ,
      ${tabelGajiNonTunai.bpjs} varchar (255) not null default '',
      ${tabelGajiNonTunai.kesehatan} varchar (255) not null default '',
      ${tabelGajiNonTunai.komunikasi} varchar (255) not null default '',
      primary key (${tabelGajiNonTunai.nik})
    )`

    let query = db.query(sql,(c,d)=>{
      if(c){
        b.send([{"status":"error","keterangan":c.message}])
      }else{
        b.send([{"status":"berhasil","keterangan":"ok"}])
      }
    })
  })

  app.post("/masukkan/data/pegawai",(a,b)=>{
      b.send(a.body)
  })

  app.get("/",(a,b)=>{
    b.send(`[{"status":"ok"}]`)
  })

  app.post("/kirim",(a,b)=>{
    b.send(a.body.nama)
  })

  app.get('*',(a,b)=>{
    b.send("kesalahan url")
  })

  app.listen(PORT,()=>{
    console.log(`app run on port : ${PORT}`)
  })
```

```python
<VirtualHost *:80>
    ServerName myabsen.com
    ServerAlias www.myabsen.com

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Directory "/var/www/myabsen.com/">
    # AllowOverride All
     Order Allow,Deny
     Allow from all
     AllowOverride all
    # Header set Access-Control-Allow-Origin "*"
     Header add Access-Control-Allow-Origin "*"
     Header add Access-Control-Allow-Headers "origin, x-requested-with, content-type"
     Header add Access-Control-Allow-Methods "PUT, GET, POST, DELETE, OPTIONS"
    </Directory>

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
</VirtualHost>
```

# backup presto cmobile v2


```javascript
const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')

var url = "http://dev.probussystem.net:8080"

var db_config = {
  host: "localhost",
  user: "root",
  password: "Makuro_123",
  database: "malik_data"
}

var db;
function handleDisconnect(){
  db = mysql.createConnection(db_config)

  db.connect((err)=>{
    if(err){
      console.log("connect db error",err);
      setTimeout(handleDisconnect,1000);
    }
  });

  db.on('error',(err)=>{
    console.log("db error",err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();
    } else { 
      throw err;
    }
  })
}

handleDisconnect();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Makuro_123",
//   database: "malik_data"
// })

// db.connect((err) => {
//   if (err) throw err
// })
process.on('uncaughtException', (err) => {
  if (err) {
    console.log(err)
  }
})

const app = express();
app.use(parser.json())
app.use(parser.urlencoded({
  extended: true
}))
app.use(cors({
  credentials: true,
  origin: true
}))
app.set("view engine","pug")

const userTable = {
  id: "id",
  nama: "nama",
  email: "email",
  pass: "pass",
  unit_nya: "unit_nya",
  table: "pengguna"
}

app.post("/cari_nama",(a,b)=>{
  let sql = `select * from pengguna where nama = "${a.body.nama}"`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"status":"error : ${c}"}`)
    }else{
      b.send(d)
    }
  })
  // b.send(`{"status":${JSON.stringify(a.body.nama)}}`)
})

// ======= buat tabel pengguna ========
app.post("/apa_ini",(a,b)=>{

  let sql = `insert into pengguna(nama,email,pass,unit_nya) values("malik","malik@gmail","malik","probus");`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"status":"${c.message}"}`)
    }else{
      b.send(`{"status":"ok"}`)
    }
  })
})
app.get("/", (a, b) => {
  b.render("index")
})

// ***************************
// *====== MUALI UNIT =======*
// ***************************

// ========== buat tabel tunit ===========

app.get("/tunit",(a,b)=>{
  let sql = `create table tunit (id int(100) not null auto_increment primary key, nama_unit varchar(299) not null , url_unit varchar(299) not null,reg_date timestamp default current_timestamp on update current_timestamp)`
  let mysql = db.query(sql,(c,d)=>{
    if(!c){
      b.send(`{"info":"berhasil"}`)
    }else{
      b.send(`{"info":"gagal ${c.message}"}`)
    }
  })
})


// ============== tambah unit ==============
app.post("/tambah-unit",(a,b)=>{
  let data = a.body
  let sql = `insert into tunit (id,nama_unit,url_unit) values(null,"${data.nama}","${data.url}")`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal ${c}"}`)
    }else{
      b.send(`{"info":"berhasil"}`)
    }
  })
})


// ============== dapatkan semua unit ============
app.get("/semua-unit",(a,b)=>{
  let sql = `select * from tunit`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal ${c.message}"}`)
    }else{
      b.send(d)
    }
  })
})



// hapus unit 
app.post(`/hapus-unit`,(a,b)=>{
  let data = a.body;
  
  // let sql = `
  // if (select from tsubunit where nama_unit = "${data.nama_unit}")
  // then 
  // begin 
  //   delete tunit,tsubunit from tunit,tsubunit where tunit.id = "${data.id}" 
  // and 
  //   tsubunit.nama_unit = "${data.nama_unit}" 
  // end 
  // else 
  // begin 
  //   delete from tunit where id = "${data.id}" 
  // end`
  let sql = `delete from tunit where id = "${data.id}"`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal ${c.message}"}`)
    }else{
      b.send(`{"info":"berhasil"}`)
    }
  })
})

// buat table subunit 
app.get(`/tsubunit`,(a,b)=>{
  //let sql = `drop table tsubunit`
  let sql = `create table tsubunit (id int(255) auto_increment primary key,id_user varchar(255) not null,nama_unit varchar(255) not null)`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal","data":${c.message}}`)
    }else{
      b.send(`{"info":"berhasil"}`)
    }
  })
})

// tambah sub unit
app.post(`/tambah-subunit`,(a,b)=>{
  let data = a.body
  let id = data.id_user;
  let sql = `insert into tsubunit(id,id_user,nama_unit) values(null,"${data.id_user}","${data.nama_unit}")`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal","data":${c.message}}`)
    }else{
      b.send(`{"info":"berhasil"}`)
    }
  })
})


// dapatkan semua sub unit
app.get(`/semua-subunit`,(a,b)=>{
  let sql = `select * from tsubunit`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":"gagal","data":${c.message}}`)
    }else{
      b.send(d)
    }
  })
})



// ********************************
// ******* MULAI USER *************
// ********************************

// ======== TAMBAH USER ============
app.post("/tambah-user",(a,b)=>{
  var data = a.body
  let sql = `insert into pengguna(id,nama,email,pass,unit_nya) values(null,"${data.nama}","${data.email}","${data.pass}","${data.unit}")`
  let query = db.query(sql,(c,d)=>{
    if(!c){
      b.send(`{"info":"berhasil"}`)
    }else{
      b.send(`{"info":"gagal : ${c.message}"}`)
    }
  })
})

// ========= SEMUA USER =========

app.get("/semua-user",(a,b)=>{
  let sql = `select * from pengguna`
  let query = db.query(sql,(c,d)=>{
    if(!c){
      b.send(d)
    }else{
      b.send(`{"info":"error ${c.message}"}`)
    }
  })
})

// =========== HAPUS USER =============
app.post("/hapus_user",(a,b)=>{
  var data = a.body
  let sql = `delete from pengguna where id="${data.id}"`
  let query = db.query(sql,(c,d)=>{
    if(!c){
      b.send(`{"info":"berhasil"}`)
    } 
    else{
       b.send(`{"info":"gagal"}`)
    }
   

  })
})





app.get("/create_user_table", (a, b) => {
  let sql = `create table ${userTable.table}(
        ${userTable.id} int (10) auto_increment primary key,
        ${userTable.nama} varchar(299) not null default "",
        ${userTable.email} varchar(299) not null default "",
        ${userTable.pass} varchar(299) not null default "",
        ${userTable.unit_nya} varchar(299) not null default "" 
    )`
  let query = db.query(sql, (c, d) => {
    if (c) {
      b.send(`{"status":"error","ket":"${c}}`)
    } else {
      b.send(`{"status":"ok"}`)
    }
  })
})



// ========== API UNTUK ANDROID ============


// dapatkan unit

app.get(`/unit/:nama`,(a,b)=>{
  let data = a.params.nama
  let sql = `select * from tunit where nama_unit = "${data}"`;
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":${c.message}}`)
    }else{
      b.send(d);
    }
  })
})

// ========= dapatkan email dan pass user =============
app.post("/login",(a,b)=>{
  let data = a.body.email
  let sql = `select email,pass from pengguna where email ="${data}"`
  let query = db.query(sql,(c,d)=>{
    b.send(d)
  })
})

// mendapatkan yang bersangkutan
app.get(`/usernya/:email`,(a,b)=>{
  let email = a.params.email;
  let sql = `select * from pengguna where email = "${email}"`
  let query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":${c.message}}`)
    }else{
      b.send(d)
    }
  })
})


// dapatkan sub unit
app.get(`/subunit/:id`,(a,b)=>{
  var data = a.params.id;
  var sql = `select * from tsubunit where id_user = "${data}"`
  var query = db.query(sql,(c,d)=>{
    if(c){
      b.send(`{"info":${c.message}}`)
    }else{
      b.send(d)
    }
  })
})




app.get('*', (a, b) => {
  b.send("hidup gk semudah cocote mario teguh ok")
})

setInterval(function () {
  db.query('SELECT 1');
}, 1000);

app.listen(PORT, () => {
  console.log(`app run on port : ${PORT}`)
})


```

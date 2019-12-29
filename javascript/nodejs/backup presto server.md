# backup presto mobile

### index.js

```javascript
const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Makuro_123",
  database: "malik_data"
})

db.connect((err) => {
  if (err) throw err
})
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

app.get("/nama/:nama",(a,b)=>{
  b.send(`{"status":"${a.params.nama}}`)
})

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

// percobaan buat tabel
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

// ========= dapatkan email dan pass user =============
app.post("/login",(a,b)=>{
  let data = a.body.email
  let sql = `select email,pass from pengguna where email ="${data}"`
  let query = db.query(sql,(c,d)=>{
    b.send(d)
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

app.get('*', (a, b) => {
  b.send("hidup gk semudah cocote mario teguh ok")
})

app.listen(PORT, () => {
  console.log(`app run on port : ${PORT}`)
})
```


### index.pug

```javascript
doctype html
html
    head
        meta(name="viewport" content="width=device-width, initial-scale=1")
        script(src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js")
        style
            include w3.css
            include mini.css
            include malik.css 
    body.container
        h1#info Probus Production Devision
        header
            each val in ["home","about","contact","get started"]
                button.menu(click="alert(0)")
                    a(href="")= val
        button#pr print
        #perto_mobile
            h1 presto mobile
            .container
                #buat_user.row
                    .col-lg-4.bordered
                        h3.section.dark create user
                        each buat,index in ["name","email","pass","unit"]
                            input(type="text" placeholder=buat).buat.w3-light-grey
                        #simpan.w3-input.w3-blue.w3-button.w3-padding create
                h3.margin-atas64 all user
                #table_user
         
                    
 
        script
            include malik.js
            
```


### malik.js

```javascript


// ========== MEMBUAT USER ==========
$("#simpan").click(function (e) { 

    var buats = $(".buat");
    var kosongnya = []
    var isinya = []
    var kosong = true;
    for(var i =0;i<buats.length;i++){
        if(buats[i].value == ""){
            kosong = true
            kosongnya.push(i)
        }else{
            isinya.push(buats[i])
            kosong = false
        }
    }
    if(kosong){
        for(var i =0;i<kosongnya.length;i++){
            buats[kosongnya[i]].placeholder = "not be empty"
        }
        isinya = []
        kosongnya = []
        return
    }
    
    var datanya = {
        "nama":`${isinya[0].value}`,
        "email":`${isinya[1].value}`,
        "pass":`${isinya[2].value}`,
        "unit":`${isinya[3].value}`
    }

    $.ajax({
        url: "http://103.207.97.143:8080/tambah-user",
        type: "POST",
        crossDomain: true,
        data: datanya,
        dataType: "json",
        success: (a,b) => {
            $("#info").html(a.info)
            for(var i = 0;i < buats.length;i++){
                buats[i].value  = ""
            }
            dapatkanSemuaUser()
        },
        error: function (xhr, status) {
            $("#info").html(a.info)
        }
    });
    
});

$("#pr").click(()=>{
    print()
})

// ============ mendapatkan semua user dan dijadikan table ================
dapatkanSemuaUser()
function dapatkanSemuaUser (param) { 
    $.get("/semua-user",(a,b)=>{
    var lay = `<div class=""><table class="">`
    lay += `<thead class=""><tr>`
    lay += `<th>id</th>`
    lay += `<th>Name</th>`
    lay += `<th>Email</th>`
    lay += `<th>Pass</th>`
    lay += `<th>Unit</th><th>action</th></tr></thead>`
    lay += `<tbody class="">`
    for(var i = 0;i<a.length;i++){
        lay += `<tr>`
        lay += `<td>${a[i].id}</td>`
        lay += `<td>${a[i].nama}</td>`
        lay  += `<td>${a[i].email}</td>`
        lay += `<td>${a[i].pass}</td>`
        lay  += `<td>${a[i].unit_nya}</td>`
        lay +=`<td><span id="${a[i].id}" class="w3-red circular w3-button hapus" onclick="hapus(this)">X</span></td>`
        lay += `</tr>`
    }
    lay +=`</tbody>`
    lay += "</table></div>"
    $("#table_user").html(lay)
    })
 }

// ========== hapus user ===========
function hapus(e) {
    var data = {
        "id":e.id
    }
    $.ajax({
        url:"/hapus_user",
        type: "POST",
        crossDomain: true,
        data: data,
        dataType: "json",
        success: (a,b) => {
            dapatkanSemuaUser()
        },
        error: function (xhr, status) {
            alert(a.info)
        }
    })
}

```

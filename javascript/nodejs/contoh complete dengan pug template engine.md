# dengan pug template engine


### template

```jajvascript
doctype html
html
    head
        meta(name="viewport" content="width=device-width, initial-scale=1")
        link(rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css")
        script(src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js")
    body
        h1#info buat user
        .card
            input(type="text" placeholder="masukkan nama")#nama
            button#simpan simpan

        script
            include malik.js
```


### nodejs nya

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
app.post("/apa",(a,b)=>{
  console.log(a.body)
  b.send(`{"status":"${a.body.nama}"}`)
})
app.get("/apa", (a, b) => {
  b.render("index")
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

app.get("/", (a, b) => {
  b.send(`[{"status":"ok"}]`)
})

app.get('*', (a, b) => {
  b.send("hidup gk semudah cocote mario teguh")
})

app.listen(PORT, () => {
  console.log(`app run on port : ${PORT}`)
})


```

### javascriptnya

```javascript


$("#simpan").click(()=>{
    var siapa = {"nama":"malik"}
    $.ajax({
        url: "http://localhost:8080/apa",
        type: "POST",
        crossDomain: true,
        data: siapa,
        dataType: "json",
        success: (a) => {
            $("#info").html(a.status)
        },
        error: function (xhr, status) {
            $("#info").html(status)
        }
    });
})

```

# backup flutter socket io

```dart
import 'dart:convert';

import 'package:adhara_socket_io/adhara_socket_io.dart';
import 'package:adhara_socket_io/manager.dart';
import 'package:adhara_socket_io/socket.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:prestopos/bantuan/bantuan_provider.dart';
import 'package:provider/provider.dart';



class HalamanUtama extends StatefulWidget{
  @override
  _HalamanUtamaState createState() => _HalamanUtamaState();
}

class _HalamanUtamaState extends State<HalamanUtama> {
  String _tulisan = "ini";
  MaterialColor _warna = Colors.red;

  _soketIo()async{
    SocketIOManager manager = SocketIOManager();
    SocketIO socket = await manager.createInstance(SocketOptions('http://192.168.192.188:8080',nameSpace: '/', transports: [Transports.POLLING]));
    /*socket.onConnect((data){

    });*/
    socket.on("chat", (data){   //sample event
      setState(() {
        _tulisan = data.toString();
        if(data.toString().contains("merah")){
          _warna = Colors.red;

        }else if(data.toString().contains("merah")){
          _warna = Colors.blue;

        }
      });
      print(data.toString());
    });
    socket.connect();
  }

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    _soketIo();
    super.didChangeDependencies();
  }


  @override
  Widget build(BuildContext context) {

    // TODO: implement build
    return Scaffold(
      body: SafeArea(
        child: Container(
          constraints: BoxConstraints.expand(),
          color: _warna,
          child: SingleChildScrollView(
            child: Column(
              children: <Widget>[
                Text(_tulisan)
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

### javascript

```javascript

const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')
const log = require('log-timestamp');
var socket = require('socket.io');


const app = express();
app.use(parser.json())
app.use(parser.urlencoded({
    extended: true
}))
app.use(cors({
    credentials: true,
    origin: true
}))

// mulai serever
var server = app.listen(PORT, () => {
    console.log(`app run on port : ${PORT}`)
})

// menggunakan static view
app.use(express.static("views"))

// deklarasi soket io
var io = socket(server);

// configurasi database
var db_config = {
    host: "localhost",
    user: "root",
    password: "Makuro_123",
    database: "DBCRISPYPIZZA"
}

var db;

function handleDisconnect() {
    db = mysql.createConnection(db_config)

    db.connect((err) => {
        if (err) {
            console.log("connect db error", err);
            setTimeout(handleDisconnect, 1000);
        }
    });

    db.on('error', (err) => {
        console.log("db error", err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}

// handle putus koneksi database
handleDisconnect();

// ping database
db.ping(function (err) {
    if (err) throw err;
    console.log('Server responded to ping');
})

process.on('uncaughtException', (err) => {
    if (err) {
        console.log(err)
    }
})


io.on("connection",(socket)=>{
    console.log("connected")
    socket.on("disconnect",()=>{
        console.log("io disconnect")
    })

    socket.on("chat",(msg)=>{
        io.emit("chat",msg)
        console.log(msg)
    })

})






// +++++++++++++++++++++ MULAI ROUTE ++++++++++++++++++++++++++



// cek koneksi
app.get(`/api/cek`,(req,res)=>{
    console.log("cek konecttion")
    res.send({"info":true})
})

app.get(`/api/waiter/`,(req,res)=>{
    let sql = `select * from waiter`
    db.query(sql,(err,result)=>{
        if(err){throw err}
        res.send(result)
    })
})

app.post(`/api/login`,(req,res)=>{
    var user = req.body["nama_wait"]
    var pass = req.body["sandi"]

    console.log(`try login with ${user} ${pass}`)

    let sql = `select * from waiter where nama_wait = "${user}" and sandi = "${pass}"`
    db.query(sql,(err,result)=>{
        if(err) {throw err}
        if(result.length > 0){
            res.send({"info":true,"ket":result})
        }else{
            res.send({"info":false,"ket":"user or pass not match "})
        }
    })
})







// +++++++++++++++++++++++ AKHIR ROUTE ++++++++++++++++++++++++++


// penanganan permintaan diluar route
app.get('*', (a, b) => {
    b.send("hidup gk semudah cocote mario teguh ok")
})
```

### html

```html
<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io();
    </script>

</head>

<body>
    <h1>PRESTO POS</h1>
    <input id="iptCoba" placeholder="coba" value="">
    <button id="btnCoba">coba</button>
    <ul id="inf">info</ul>


    <script>
        $(function () {
            var socket = io();
            $("#btnCoba").click(() => {
                socket.emit("chat", $("#iptCoba").val())
            })
            socket.on('chat', function (msg) {
                console.log(msg)
                $("#inf").append($("<li>").text(msg))
            });

        })
    </script>
</body>

</html>
```

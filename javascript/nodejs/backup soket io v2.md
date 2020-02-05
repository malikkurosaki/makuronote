# backup sokect io v2

### html

```html
<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script src="/socket.io/socket.io.js"></script>
</head>

<body>
    <h1>Absensi ku</h1>
    <hr>
    <div class="w3-container">
        <!-- <h3>NEW</h3>
        <input placeholder="nama">
        <input placeholder="alamat">
        <button>simpan</button>

        <ul id="messages"></ul>
        <form action="">
            <input id="m" autocomplete="off" /><button>Send</button>
        </form>
        <ul id="chat">

        </ul>
        <div id="info">disini infonya</div>
        <button id="tekan">tekan</button> -->
    <button id="tekan">tekan</button>
    <ul id="sini">


    </ul>

        <script>
            var socket = io();

            //var ioa = io();


            // $("#tekan").click(() => {
            //     socket.emit("chat", "apa kabar ya gimana kabar")
            // })
            // socket.on("chat",(msg)=>{
            //     alert(msg)
            // })

            $.get(`/data`,(a,b)=>{
                for(var i = 0;i<a.length;i++){
                    $("#sini").append($("<li>").text(a[i].clm_nama))
                }
            })

            $("#tekan").click(()=>{
                socket.emit("chat","pesannya")
            })
            socket.on("chat",(msg)=>{
                $("#sini").append($("<li>").text(msg))
            })


            $(function () {
                var socket = io();
                $('form').submit(function (e) {
                    e.preventDefault(); // prevents page reloading
                    socket.emit('chat', $('#m').val());
                    $('#m').val('');
                    return false;
                });



                // socket.on("chat message",(msg)=>{
                //     $("#chat").append($("<li>").text(msg))
                // })

                // socket.on("new_client",(msg)=>{
                //     var a = ""
                //     for(var i = 0;i< msg.length;i++){
                //         a += msg[i].clm_nama+"<br>"
                //     }
                //     console.log(a)
                //     $("#info").html(a)
                // })

                //socket.emit("chat message","apa kabar")

            });
        </script>
    </div>
</body>

</html>
```

### javascript

```javascript
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')
const log = require('log-timestamp');
const app = express();
var http = require('http');
var socket = require('socket.io');

var server = app.listen(PORT, () => {
    console.log(`app run on port : ${PORT}`)
})
app.use(express.static("views"))
var io = socket(server);


var db_config = {
    host: "localhost",
    user: "root",
    password: "Makuro_123",
    database: "DB_ABSENSIKU"
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

handleDisconnect();



app.use(parser.json())
app.use(parser.urlencoded({
    extended: true
}))
app.use(cors({
    credentials: true,
    origin: true
}))

io.on('connection', function (socket) {
    console.log('a user connected');
    

    socket.on('chat message', function (msg) {
        console.log(msg)
        io.emit("chat message", msg)
    });
    socket.on("chat",(msg)=>{
        io.emit("chat",msg)
    })
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // socket.on("data_client",(msg)=>{
    //     db.query(`select * from tbl_perusahaan`,(err,data)=>{
    //         io.emit("data_client",data)
    //     })
    // })
});

// io.on("chat",(msg)=>{
//     console.log(msg)
// })


// ============== MULAI ROUTE ===============

app.get(`/data`,(req,res)=>{
    db.query(`select * from tbl_perusahaan`,(err,data)=>{
        res.send(data)
    })
})
app.get(`/systemcall-buattable-perusahaan`, (a, b) => {
    let perintah = "";
    let data = {
        "tbl_perusahaan": {
            "clm_id": "int primary key auto_increment",
            "clm_nama": "varchar(255)",
            "clm_alamat": "varchar(255)"
        }
    }

    let tbl = Object.keys(data)
    let kunci = Object.keys(data[tbl])
    let val = Object.values(data[tbl])

    for (var i = 0; i < kunci.length; i++) {
        perintah += `${kunci[i]} ${val[i]},`
    }

    let order = perintah.split().toString().replace(/,(?=[^,]*$)/, '')
    let sql = `create table ${tbl}(${order})`
    db.query(sql, (err, data) => {
        if (err) {
            b.send({
                "info": false,
                "ket": err.message
            })
            console.log(err.message)
        } else {
            b.send({
                "info": true
            })
            console.log(`berhasil membat table ${tbl}`)
        }
    })
})

app.post(`/api/new-perusahaan`, (req, res) => {
    var kunci = Object.keys(req.body).toString()
    var value = JSON.stringify(Object.values(req.body)).replace(/(\[)|(])/g,"")
    let sql = `insert into tbl_perusahaan(${kunci}) values(${value})`
    db.query(sql,(err,data)=>{
        if(err){
            res.send({"info":false,"ket":err.message})
        }else{
            //io.emit("new_client","apa kabarnya")
            db.query(`select * from tbl_perusahaan`,(err,data)=>{
                if(err){
                    io.emit("new_client",err.message)
                }else{
                    io.emit("new_client",data)
                }
            })
            res.send({"info":true})
        }
    })
})


// ============= TERAKHIR ROUTE ==============

app.get('*', (a, b) => {
    b.send("hidup gk semudah cocote mario teguh ok")
})

//   setInterval(function () {
//     db.query('SELECT 1');
//   }, 1000);
```


### manifest xml

```xml
<application
        android:name="io.flutter.app.FlutterApplication"
        android:label="adhara_socket_io_example"
        android:usesCleartextTraffic="true"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"...>...</activity>
```


# backup socket io 

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
        <h3>NEW</h3>
        <input placeholder="nama">
        <input placeholder="alamat">
        <button>simpan</button>

        <ul id="messages"></ul>
        <form action="">
            <input id="m" autocomplete="off" /><button>Send</button>
        </form>
        <ul id="chat">
        </ul>

        <script>
            var socket = io();


            $(function () {
                var socket = io();
                $('form').submit(function (e) {
                    e.preventDefault(); // prevents page reloading
                    socket.emit('chat message', $('#m').val());
                    $('#m').val('');
                    return false;
                });

                socket.on("chat message",(msg)=>{
                    $("#chat").append($("<li>").text(msg))
                })
            });
        </script>
    </div>
</body>

</html>
```

### node js
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
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        io.emit("chat message",msg)
    });
});



// ============== MULAI ROUTE ===============


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

app.post(`/api/new-perusahaan`,(req,res)=>{
    res.send(apa())
})

function apa(){
    return "apa kabar"
}

// ============= TERAKHIR ROUTE ==============

app.get('*', (a, b) => {
    b.send("hidup gk semudah cocote mario teguh ok")
})

//   setInterval(function () {
//     db.query('SELECT 1');
//   }, 1000);

```


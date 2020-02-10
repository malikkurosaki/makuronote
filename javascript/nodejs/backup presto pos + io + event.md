# backup presto pos + io + event

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
const MySQLEvents = require('@rodrigogs/mysql-events');


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
    password: "makuro123",
    database: "DBCRISPYPIZZA"
}

var db;

function handleDisconnect(){
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

 const instance = new MySQLEvents(db_config, {
        startAtEnd: true,
        excludedSchemas: {
        mysql: true,
        },
    });

    instance.start();
    instance.addTrigger({
    name: 'TEST',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (data) => { // You will receive the events here
       var table = data.table
       if(table == "meja_isi"){
           console.log("emit meja isi")
           io.emit("meja_isi","meja_isi")
       }else if(table == "listbill"){
           io.emit("listbill","listbill");
           console.log("emit listbill")
       }
    },
  });
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

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

// ============================================================================================ socket io

io.on('connection', (socket) => {
    console.log('*** server io connected ***');
    socket.on('disconnect', function () {
        console.log('XXX user disconnected XXX');
    });
    socket.on("meja_isi", (message) => {
        io.emit("meja_isi", message)
        console.log("+++ socket io meja isi +++")
    })
    socket.on("listbill", (message) => {
        io.emit("listbill", (message))
        console.log(" --- soket io listbill ---")
    })
});

// +++++++++++++++++++++ MULAI ROUTE ++++++++++++++++++++++++++

// ================================================================================ tanggal
app.get(`/api/tanggal`, (a, b) => {
    let sql = `select date_format(current_date(),"%Y-%m-%d") as tanggal,CURRENT_TIME() as jam`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
        console.log("*|||* AMBIL TANGGAL *|||*")
    })
})

// ================================================================================ cek koneksi
app.get(`/api/cek`, (req, res) => {
    console.log(" >>>>>>> cek konecttion <<<<<<<<")
    res.send({
        "info": true
    })
    console.log(`*** cek koneksi ***`)
})

// =============================================================================== waiter
app.get(`/api/waiter/`, (req, res) => {
    let sql = `select * from waiter`
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        res.send(result)
        console.log(`*** ambil data waiter ***`)
    })
})

// ============================================================================== outlet configurasi
app.get(`/api/outlet-configurasi/:kode`, (a, b) => {
    let sql = `select outlet.*,configurasi.* from outlet left join configurasi on outlet.kode_out = configurasi.kode where outlet.kode_out = "${a.params.kode}"`;
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
        console.log(`*** ambil configurasi ***`)
    })
})

// =============================================================================== bill

app.get(`/api/lihat-bill`, (a, b) => {
    let sql = `select * from bill limit 1`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
    })
})

app.post(`/api/simpan-bill`, (a, b) => {
    var kunci = Object.keys(a.body[0])
    var kunci2 = JSON.stringify(kunci).replace(/\[/g, "(").replace(/\]/g, ")").replace(/\"/g, "`")
    var val = []
    var updateBill = ""

    for (var i = 0; i < kunci.length; i++) {
        updateBill += "`" + kunci[i] + "`= values(`" + kunci[i] + "`),"
    }

    updateBill = updateBill.replace(/\,$/g, "")

    for (var i = 0; i < a.body.length; i++) {
        val.push(Object.values(a.body[i]))

    }
    val = JSON.stringify(val).replace(/\[\[/g, "(").replace(/\]\,\[/g, "),(").replace(/\]\]/g, ")")

    let sql = `insert into bill ${kunci2} values${val} on duplicate key update ${updateBill}`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send({
            "info": true
        })
    })

})

app.get(`/api/lihat-billbynobill/:nobill`, (a, b) => {
    let sql = `select bill.*,produk.nama_pro from bill left join produk on bill.kode_pro = produk.kode_pro where nobill ="${a.params.nobill}"`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
    })
})

// ============================================================================ listbill
app.get(`/api/listbill`, (a, b) => {
    let sql = `select * from listbill limit 1`
    db.query(sql, (err, data) => {
        if (err) {
            throw err
        }
        b.send(data)
    })
})

app.get(`/api/lihat-listbillbynobill/:nobill`, (a, b) => {
    let sql = `select * from listbill where nobill ="${a.params.nobill}"`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
    })
})

// simpan list bill
app.post(`/api/simpan-listbill`, (a, b) => {
    var kunci = JSON.stringify(Object.keys(a.body)).replace(/\[/g, "(").replace(/\]/g, ")").replace(/\"/g, "`")
    var kunciUpdate = Object.keys(a.body)
    var val = JSON.stringify(Object.values(a.body)).replace(/\[/g, "(").replace(/\]/g, ")")
    var valUpdate = Object.values(a.body)

    var update = ""
    for (var i = 0; i < Object.keys(a.body).length; i++) {
        update += "`" + kunciUpdate[i] + "` = values(`" + kunciUpdate[i] + "`),"
    }
    update = update.replace(/\,$/g, "")
    let sql = `insert into listbill${kunci} values${val} on duplicate key update ${update}`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send({
            "info": true
        })
        console.log("save / update listbill")
    })
})


// simpan bill listbill
app.post(`/api/simpan-bill-listbill`, (a, b) => {

    // ========== untuk bill
    var kunciBill = Object.keys(a.body["bill"][0])
    var kunci2Bill = JSON.stringify(kunciBill).replace(/\[/g, "(").replace(/\]/g, ")").replace(/\"/g, "`")
    var valBill = []
    var updateBill = ""

    for (var i = 0; i < kunciBill.length; i++) {
        updateBill += "`" + kunciBill[i] + "`= values(`" + kunciBill[i] + "`),"
    }

    updateBill = updateBill.replace(/\,$/g, "")

    for (var i = 0; i < a.body["bill"].length; i++) {
        valBill.push(Object.values(a.body["bill"][i]))
    }
    valBill = JSON.stringify(valBill).replace(/\[\[/g, "(").replace(/\]\,\[/g, "),(").replace(/\]\]/g, ")")
    let sqlBill = `insert into bill ${kunci2Bill} values${valBill} on duplicate key update ${updateBill}`

    // ============== untuk list bill

    var kunciListBill = JSON.stringify(Object.keys(a.body["listbill"])).replace(/\[/g, "(").replace(/\]/g, ")").replace(/\"/g, "`")
    var kunciUpdateListBill = Object.keys(a.body["listbill"])
    var valListBill = JSON.stringify(Object.values(a.body["listbill"])).replace(/\[/g, "(").replace(/\]/g, ")")
    var valUpdateListbill = Object.values(a.body["listbill"])

    var updateListBill = ""
    for (var i = 0; i < Object.keys(a.body["listbill"]).length; i++) {
        updateListBill += "`" + kunciUpdateListBill[i] + "` = values(`" + kunciUpdateListBill[i] + "`),"
    }
    updateListBill = updateListBill.replace(/\,$/g, "")
    let sqlListbill = `insert into listbill${kunciListBill} values${valListBill} on duplicate key update ${updateListBill}`


    db.beginTransaction((err) => {
        console.log("*************************************************")
        console.log("*** mencoba memulai transaksi bill - listbill ***")
        if (err) throw err
        db.query(sqlBill, (err, data) => {
            console.log("mencoba menyimpan bill")
            if (err) {
                db.rollback(function () {
                    console.log("XXX kegagalan menyimpan bill , data di rollback XXX")
                    throw err;

                });
                console.log(`menyimpan bill berhasil`)
            }
            console.log("menyimpan bill berhasil ...")
            db.query(sqlListbill, (err, data) => {
                console.log(`mencoba menyimpan list bill`)
                if (err) {
                    db.rollback(function () {
                        console.log("XXX kegagalan menyimpan listbill , data di rollback XXX")
                        throw err;

                    });

                } else {
                    console.log(`menyimpan listbill berhasil ...`)
                    db.commit(function (err) {
                        console.log("coba commit bill list bill ... ")
                        if (err) {
                            db.rollback(function () {
                                console.log("XXX kegagalan commit bill listbill XXX")
                                throw err;
                            });
                        } else {
                            console.log("*** simpan commit bill dan list bill berhasil ***")
                            console.log("*************************************************")
                            b.send({
                                "info": true
                            })
                            io.emit("meja_booked", "meja_booked")
                        }

                    })
                }
            })
        })

    })

})

// ============================================================================ meja
app.get(`/api/listmeja`, (a, b) => {
    let sql = `select * from listmeja`
    db.query(sql, (err, data) => {
        if (err) {
            throw err
        }
        b.send(data)
    })


})

app.get(`/api/lihat-mejaopen`, (a, b) => {
    let sql = `select * from listbill where tanggal = date(current_date()) and stt = "open"`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
    })
})

// =========================================================================== meja isi

// lihat meja isi
app.get(`/api/mejaisi`, (a, b) => {
    let sql = `select * from meja_isi `
    db.query(sql, (err, data) => {
        if (err) {
            throw err
        }
        b.send(data)
    })
})

// simpan meja isi
app.post(`/api/simpan-mejaisi`, (a, b) => {
    var kunci = JSON.stringify(Object.keys(a.body)).replace(/\[|\]/g, "").replace(/\"/g, "`")
    var val = JSON.stringify(Object.values(a.body)).replace(/\[/g, "(").replace(/\]/g, ")")
    let sql = `insert into meja_isi (${kunci}) values${val}`
    db.query(sql, (err, data) => {
        if (err) throw err
        else
            db.query(`select * from meja_isi`, (err, data) => {
                if (err) throw err
                else
                    b.send({
                        "info": true
                    })
                console.log(`@@@ simpan meja ${a.body["meja"]} @@@`);
                //io.emit("meja", "update meja isi")
            })
    })
})

app.get(`/api/hapus-mejaisi/:apa`, (a, b) => {
    var sql = `delete from meja_isi where meja = "${a.params.apa}"`
    db.query(sql, (err, data) => {
        if (err) throw err
        else
            b.send({
                "info": true
            })
        console.log(`XXX hapus meja ${a.params.apa} XXX`)
        io.emit("hapus_meja", "menghapus meja ")
    })
})

app.get(`/api/hapus-mejaisi/all`, (a, b) => {
    let sql = `delete from meja_isi`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send({
            "info": true
        })
    })
})


// ==================================================================================== lihat customer

app.get(`/api/lihat-customer`, (a, b) => {
    let sql = `select * from customer`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
        console.log("lihat customer")
    })
})

app.get(`/api/lihat-customerbyname/:name`, (a, b) => {
    let sql = `select * from customer where nm_cus like `
})


// ==================================================================================== produk

app.get(`/api/lihat-produk`, (a, b) => {
    let sql = `select * from produk`
    db.query(sql, (err, data) => {
        if (err) throw err
        else b.send(data)
    })
})




// ===================================================================================== login
app.post(`/api/login`, (req, res) => {
    var user = req.body["nama_wait"]
    var pass = req.body["sandi"]

    console.log(`try login with ${user} ${pass}`)

    let sql = `select * from waiter where nama_wait = "${user}" and sandi = "${pass}"`
    console.log("******** MENCOBA LOGIN *********")
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        if (result.length > 0) {
            res.send({
                "info": true,
                "ket": result
            })
        } else {
            res.send({
                "info": false,
                "ket": "user or pass not match "
            })
            console.log("### USER OR PASSWORD NOT MATCH ###")
        }
    })
})









// +++++++++++++++++++++++ AKHIR ROUTE ++++++++++++++++++++++++++


// penanganan permintaan diluar route
app.get('*', (a, b) => {
    b.send("hidup gk semudah cocote mario teguh ok")
})

```

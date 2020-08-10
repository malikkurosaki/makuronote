# backup presto post 10-08-20

_package.js_
```js
{
  "name": "prestopos",
  "version": "1.0.0",
  "description": "",
  "main": "prestopos.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@rodrigogs/mysql-events": "^0.6.0",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "log-timestamp": "^0.3.0",
    "mysql": "github:mysqljs/mysql",
    "pug": "^2.0.4",
    "socket.io": "^2.3.0"
  }
}
```

_index.js_
```js
var express = require('express');
var path = require('path');
var http = require('http');
var PORT = process.env.PORT || 8080;
var mysql = require('mysql');
var parser = require('body-parser');
var cors = require('cors');
var log = require('log-timestamp');
var socket = require('socket.io');
var MySQLEvents = require('@rodrigogs/mysql-events');

// cek local
var conf = require('./conf.json');
var pack = require('./package.json');

// instalation
// - npm install express
// - npm install mysql
// - npm install body-parser
// - npm install cors
// - npm install log-timestamp
// - npm install socket.io
// - npm install @rodrigogs/mysql-events
// - npm install pug


// ======= catatan tambahan =======
// tambah colum di listmeja "urut int not null primary key defult 0"
// tambah table log_in 
// tambah print_port di printer_order varchar(199)
// setting my.ini


var app = express();
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

app.use(cors({
    credentials: true,
    origin: true
}));

// mulai serever
var server = app.listen(PORT, () => {
    console.log(`app run on port : ${PORT}`);
});

// menggunakan static view
app.use(express.static("views"))
//app.set('view engine', 'pug')

// deklarasi soket io
var io = socket(server);

//configurasi database
var db_config = {
    host: conf.host,
    user: conf.user,
    password: conf.pass,
    database: conf.db,
    dateStrings:"DATE"
}

// var db_config = {
//     host: "172.16.34.2",
//     user: 'root',
//     password: 'Probus@TheSwell0820',
//     database: 'dbswellhostel',
//     dateStrings:"DATE"
// }

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
        
        let dat = JSON.stringify(data)
        let table = data.table;
        let type = data.type
        let dataBase = data.schema
        let ket = JSON.stringify(data.affectedRows)
     
        console.log("========= MYSQL EVENT=========")
        console.log("")
        console.log("table : "+table)
        console.log("type : "+type)
        console.log("keterangan : "+ket)
        console.log("")
        console.log("==============================")
       
        io.emit("update_meja",data.table);
        
    },
  });
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

// ping database
db.ping(function (err) {
    if (err){
        console.log("")
        console.log(`error ping server`)
        console.log("")
    }else{
        console.log("")
        console.log('Server responded to ping');
        console.log("")
    }

})




// ============================================================================================ socket io

io.on('connection', (socket) => {
    console.log('*** server io connected ***');
    socket.on('disconnect', function () {
        console.log("")
        console.log("=========== SOCKET IO SERVER ===========")
        console.log('XXX user disconnected XXX');
        console.log("========================================")
        console.log("")
    });
//    socket.on("update_meja",(message)=>{
//        io.emit("update_meja", (message))
//        console.log("update_meja socket io")
//    })
});

// +++++++++++++++++++++ MULAI ROUTE ++++++++++++++++++++++++++

app.get(`/`,(a,b)=>{
  b.render(`index`,{"conf":conf,"pack":pack})
})

app.get(`/conf`,(a,b)=>{
    b.send(conf)
})

app.get(`/pack`,(a,b)=>{
    b.send(pack.dependencies)
})

// sugest catatan order
app.get(`/api/lihat-catatan`,(a,b)=>{
    console.log("coba lihat catatan")
    let sql = `select * from mcatat`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error liaht catatan`)
        }else{
            b.send(data)
        }

    })
})

// ============================================================================ token

// hapus token
app.post(`/api/hapus-token`,(a,b)=>{
    console.log("coba hapus token")
    let sql = `delete from log_in where token = "${a.body.token}"`
    db.query(sql,(err,data)=>{
        if(err) {
            console.log(`error hapus token`)
            b.send(false)
        }else{
            b.send(true)
        }

    })
})


// simpan token
app.post(`/api/simpan-token`,(a,b)=>{
    console.log("coba simpan token")
    let sql = `insert into log_in(kode_wait,tanggal,token) values("${a.body.kode_wait}","${a.body.tanggal}","${a.body.token}")`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error saat menyimpan token ${err}`)
            b.send(false)
        }else{
            b.send(true)
        }

    })


})

// cek token
app.get(`/api/lihat-token/:kode_wait`,(a,b)=>{
    console.log("coba lihat token dengan kode waiter")
    let sql = `select * from log_in where kode_wait = "${a.params.kode_wait}"`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat token`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

// lihat token
app.get(`/api/cek-token/:token`,(a,b)=>{
    console.log("coba cek token")
    let sql = `select token from log_in where token = "${a.params.token}"`;
    db.query(sql,(err,data)=>{
        if(err){
            b.send(false)
            console.log("error cek token ${err}")
        }else{
            console.log(`cek token ${a.params.stroke}`)
            b.send(data)
        }
    })
})

app.get(`/api/lihat-userbytoken/:token`,(a,b)=>{
    console.log("coba lihat user by token")
    let sql = `select waiter.* from waiter left join log_in on waiter.kode_wait = log_in.kode_wait where log_in.token = "${a.params.token}"`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat waiter by token ${err}`)
            b.send(false)
        }else{
            b.send(data)
        }
    })
})


// ================================================================================ tanggal
app.get(`/api/tanggal`, (a, b) => {
    console.log("coba lihat tanggal")
    let sql = `select current_date() as tanggal,current_time() as jam`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error dapatkan tanggal`)
            b.send(false)
        }else{
            b.send(data)
            console.log("*|||* AMBIL TANGGAL *|||*")
        }

    })
})

// ================================================================================ cek koneksi
app.get(`/api/cek`, (a,b) => {
    console.log("cek server connection")
    b.send(true)
})

// =============================================================================== waiter
app.get(`/api/waiter/`, (a,b) => {
    console.log("coba api waiter")
    let sql = `select * from waiter`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`error waiter ${err}`)
            b.send(false)
        }else{
            b.send(result)
            console.log(`*** ambil data waiter ***`)
        }

    })
})

// ============================================================================== outlet configurasi
app.get(`/api/outlet-configurasi/:kode`, (a, b) => {
    console.log("coba lihat outlet configurasi")
    let sql = `select outlet.*,configurasi.* from outlet left join configurasi on outlet.kode_out = configurasi.kode where outlet.kode_out = "${a.params.kode}"`;
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error outlet configurasi`)
            b.send(false)
        }else {
            b.send(data)
            console.log(`*** ambil configurasi ***`)
        }

    })
})

app.get(`/api/lihat-outlet`,(a,b)=>{
    console.log("coba lihat outlet")
    let sql = `select * from outlet`
    db.query(sql,(err,data)=>{
        if(err){
            b.send(false)
            console.log(`error melihat outlet ${err}`)
        }else{
            b.send(data)
        }
    })
})


app.get(`/api/lihat-moutlet`,(a,b)=>{
    console.log("coba lihat moutlet")
    let sql = `select * from moutlet`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat moutlet ${err}`)
            b.send(false)
        }else{
            b.send(data)
        }
    })
})
// =============================================================================== bill

app.get(`/api/lihat-bill`, (a, b) => {
    console.log("coba lihat bill")
    let sql = `select * from bill limit 1`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`error lijhat bill`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

app.post(`/api/simpan-bill`, (a, b) => {
    console.log("coba simpan bill")
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
        if (err){
            console.log(`error simpan bill`)
            b.send(false)
        }else{
            b.send({"info": true})
        }
        //io.emit("update_meja","update_meja")
    })

})

app.get(`/api/lihat-billbynobill/:nobill`, (a, b) => {
    console.log("lihat bill by no bill")
    let sql = `select b.*,p.nama_pro,p.cetak_ke,po.print_port from bill b left join produk p on b.kode_pro = p.kode_pro left join printer_order po on p.cetak_ke = po.kode where b.kode_pro = p.kode_pro and b.nobill ="${a.params.nobill}"`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error bill by nobill`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

// ============================================================================ listbill
app.get(`/api/listbill`, (a, b) => {
    console.log("/api/listbill")
    let sql = `select * from listbill limit 1`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`error listbill `)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

app.get(`/api/lihat-listbillbynobill/:nobill`, (a, b) => {
    console.log("/api/lihat-listbillbynobill/:nobill")
    let sql = `select * from listbill where nobill ="${a.params.nobill}"`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`error lihat listbill by no bill`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

// simpan list bill
app.post(`/api/simpan-listbill`, (a, b) => {
    console.log("`/api/simpan-listbill")
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
        if (err){
            console.log(`error simpan list bill`)
            b.send(false)
        }else {
            b.send({"info": true})
            console.log("save / update listbill")
        }

        //io.emit("update_meja","update_meja")
    })
})


// simpan bill listbill
app.post(`/api/simpan-bill-listbill`, (a, b) => {
    console.log("/api/simpan-bill-listbill")
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
        if (err){
            console.log(`error simpan bill list bill`)
            b.send(false)
        }else{


        db.query(sqlBill, (err, data) => {
            console.log("mencoba menyimpan bill")
            if (err) {
                db.rollback(function () {
                    console.log("XXX kegagalan menyimpan bill , data di rollback XXX")
                    b.send(false);

                });
                console.log(`menyimpan bill berhasil`)
            }
            console.log("menyimpan bill berhasil ...")
            db.query(sqlListbill, (err, data) => {
                console.log(`mencoba menyimpan list bill`)
                if (err) {
                    db.rollback(function () {
                        console.log("XXX kegagalan menyimpan listbill , data di rollback XXX")
                        b.send(false);

                    });

                } else {
                    console.log(`menyimpan listbill berhasil ...`)
                    db.commit(function (err) {
                        console.log("coba commit bill list bill ... ")
                        if (err) {
                            db.rollback(function () {
                                console.log("XXX kegagalan commit bill listbill XXX")
                                b.send(false);
                            });
                        } else {
                            console.log("*** simpan commit bill dan list bill berhasil ***")
                            console.log("*************************************************")
                            b.send(true)
                            // io.emit("meja_booked", "meja_booked")
                            // io.emit("update_meja","update_meja")
                        }

                    })
                }
            })
        })

        }
    })

})



// ============================================================================ meja


// mengurutkan meja
app.post(`/api/simpan-mejaurut`,(a,b)=>{
    var data = a.body
    var ky = Object.keys(data[0])
    var val = ""
    
    for(var i = 0;i<data.length;i++){
       val += `("${data[i]['meja']}",${data[i]['urut']}),`
    }
    val = val.replace(/,\s*$/g,"")
    let sql = `insert into listmeja(${ky}) values ${val} on duplicate key update meja = values(meja),urut = values(urut)`
    
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error meja urut ${err}`)
            b.send(false)
        }else{
            console.log("update meja urut true")
            b.send(true)
        }
    })
   
})


// lihat meja urut
app.get(`/api/lihat-mejaurut`,(a,b)=>{
    let sql = `select * from listmeja`
    db.query(sql,(err,data)=>{
        if(err){
            if(err){
                console.log(err)
                b.send(false)
            }
        }else{
            b.send(data)
        }
    })
})

app.get(`/api/listmeja`, (a, b) => {
    console.log("/api/listmeja")
    let sql = `select * from listmeja`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`error list meja ${err}`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})



// list lihat table
app.get(`/api/lihat-table`,(a,b)=>{
    console.log("/api/lihat-table")
    let sql = `
        select DISTINCT
        listmeja.meja as list_meja,
        listmeja.urut as urut,
        coalesce(meja_isi.meja,'') as meja_isi,
        coalesce(meja_isi.lokasi,'') as lokasi,
        coalesce(listbill.nobill,'') as nobill,
        coalesce(listbill.meja,'') as meja_open,
        coalesce(listbill.pax,'') as pax ,
        coalesce(listbill.kode_wait,'') as waiter,
        coalesce(listbill.jam_order,'') as jam_order,
        coalesce(listbill.warna,'') as warna,
        case when listbill.meja is null then '' else time_format(timediff(curtime(),listbill.jam_order),"%H:%i") end as durasi
        from listmeja left join meja_isi
        on listmeja.meja = meja_isi.meja
        left join listbill
        on listmeja.meja = listbill.meja
        and listbill.tanggal = curdate()
        and listbill.stt = 'open'
        order by urut
        `;
    //order by listmeja.meja + 1
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat table ${err}`)
            b.send([])
        }else{
            b.send(data)
        }

    })
})


//date_format(current_date(),"%Y-%m-%d")
app.get(`/api/lihat-mejaopen`, (a, b) => {
    console.log("/api/lihat-mejaopen")
    let sql = `select * from listbill where tanggal = current_date() and stt = "open"`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error meja open`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

// =========================================================================== meja isi

// lihat meja isi
app.get(`/api/mejaisi`, (a, b) => {
    console.log("/api/mejaisi")
    let sql = `select * from meja_isi `
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error lihat meja isi`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})


app.get(`/api/cek-mejaisi/:meja`,(a,b)=>{
    let sql = `select count(meja) as meja from meja_isi where meja = "${a.params.meja}"`;
    db.query(sql,(err,data)=>{
        b.send(data)
    })
})

app.get(`/api/lihat-mejabyno/:no`,(a,b)=>{
    console.log("/api/lihat-mejabyno/:no")
    let sql = `select * from meja_isi where meja = "${a.params.no}"`
    db.query(sql,(err,data)=>{
        if(err){
            console.log("error lihat meja isi by no meja : ${err}")
            b.send(false)
        }else{
            b.send(data)
        }
    })
})

// simpan meja isi 
app.post(`/api/simpan-mejaisi`, (a, b) => {
    console.log("try save meja isi");
    var kunci = JSON.stringify(Object.keys(a.body)).replace(/\[|\]/g, "").replace(/\"/g, "`")
    var val = JSON.stringify(Object.values(a.body)).replace(/\[/g, "(").replace(/\]/g, ")")
    let sql = `replace into meja_isi (${kunci}) values${val}`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error simpan meja isi ${err}`)
            b.send(false)
        }else{
            b.send(true)
            console.log(`@@@ simpan meja ${a.body["meja"]} @@@`);
        }

        //io.emit("update_meja", "update_meja")
    })
})

app.get(`/api/hapus-mejaisi/:apa`, (a, b) => {
    console.log("/api/hapus-mejaisi/:apa")
    var sql = `delete from meja_isi where meja = "${a.params.apa}"`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error hapus meja isi`)
            b.send(false)
        }else{
            b.send(true)
            console.log(`XXX hapus meja ${a.params.apa} XXX`)
        }

        // io.emit("hapus_meja", "menghapus meja ")
        // io.emit("update_meja","update_meja")
    })
})

app.get(`/api/hapus-mejaisi/all`, (a, b) => {
    console.log("/api/hapus-mejaisi/all")
    let sql = `delete from meja_isi`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error hapus semua meja isi`)
            b.send(false)
        }else{
            b.send({"info":true})
        }
        //io.emit("update_meja","update_meja")
    })
})


// ==================================================================================== lihat customer

app.get(`/api/lihat-customer`, (a, b) => {
    console.log("/api/lihat-customer")
    let sql = `select nm_cus from customer`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error lihat customer ${err}`)
            b.send(false)
        }else{
            b.send(data)
            console.log("lihat customer")
        }

    })
})

app.get(`/api/lihat-customerbyname/:name`, (a, b) => {
    let sql = `select * from customer where nm_cus like `
})


// ==================================================================================== produk

app.get(`/api/lihat-produk`, (a, b) => {
    console.log("/api/lihat-produk")
    //`select outlet.*,configurasi.* from outlet left join configurasi on outlet.kode_out = configurasi.kode where outlet.kode_out = "${a.params.kode}"`
    //let sql = `select p.*,po.print_port from produk p left join printer_order po on p.cetak_ke = po.kode  order by p.nama_pro`
    let sql = `select produk.*,printer_order.*,outlet.*,configurasi.* from produk left join printer_order on produk.cetak_ke = printer_order.kode left join outlet on produk.kode_out = outlet.kode_out left join configurasi on produk.kode_out = configurasi.kode order by produk.nama_pro`
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error lihat product ${err}`)
            b.send(false)
        }else{
            b.send(data)
        }
    })
})


// ===================================================================================== printer order
app.get(`/api/lihat-printerorder`,(a,b)=>{
    console.log("/api/lihat-printerorder")
    let sql = `select * from printer_order`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat print order`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})




// ===================================================================================== login
app.get(`/api/login/:user/:pass`, (a, b) => {
    var user = a.params.user
    var pass = a.params.pass

    console.log(`try login with ${user} ${pass}`)

    let sql = `select kode_wait from waiter where nama_wait = "${user}" and sandi = "${pass}"`
    console.log("******** MENCOBA LOGIN *********")
    db.query(sql, (err, data) => {
        if (err){
            console.log(`error ketika coba login ${err}`)
            b.send(false)
        }else{
            b.send(data)
        }

    })

})



// ================================================================================= lihat bill dan listbill

app.get(`/api/lihat-bill-sekarang`,(a,b)=>{
    let sql = `select * from bill where tanggal = curdate()`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat bill sekarang`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

app.get(`/api/lihat-listbill-sekarang`,(a,b)=>{
    let sql = `select * from listbill where tanggal = curdate()`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error lihat list bill`)
            b.send(false)
        }else{
            b.send(data)
        }

    })
})

//,warna = 2
app.get(`/api/update-billcetak/:nobill`,(a,b)=>{
    console.log("try update bill cetak to 1 after print nobill :"+a.params.nobill)
    let sql = `update bill set cetak = 1 where nobill = "${a.params.nobill}"`;
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error update bill cetak ${err}`)
            b.send(false)
        }else{
            b.send(true)
        }

        //io.emit("update_meja","update_meja")
    })
})

app.get(`/api/update-warna/:nobill`,(a,b)=>{
    console.log(`update warna dengan nobill ${a.params.nobill}`)
    let sql = `update listbill set warna = "2" where nobill = "${a.params.nobill}"`
    db.query(sql,(err,data)=>{
        if(err){
            console.log(`error update warna listbill: ${err}`)
            b.send(false)
        }else{
            b.send(true)
        }
    })
})


// +++++++++++++++++++++++ AKHIR ROUTE ++++++++++++++++++++++++++


// penanganan permintaan diluar route
app.get('*', (a, b) => {
    b.send("hidup gk semudah cocote mario teguh ok")
})

setInterval(function () {
    db.query('SELECT 1');
}, 5000);
```

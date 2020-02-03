# backup presto pos

```javascript
// bismillahirrohmanirrohim

const express = require('express')
const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 8080
const mysql = require('mysql')
const parser = require('body-parser')
var cors = require('cors')
var jsonSql = require('json-sql')({
  dialect: "mysql",
  namedValues: true,
  separatedValues: true
});
var log = require('log-timestamp');


// ========= coneksi ke mysql ===========
var db_config = {
  host: "localhost",
  user: "root",
  password: "Makuro_123",
  database: "DBCRISPYPIZZA"
}

var db;

// ======= handle disconect mysql ========
function handleDisconnect() {
  db = mysql.createConnection(db_config, {
    multipleStatements: true
  })

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

// template engine
app.set("view engine", "pug")


// ============ MULAI ROUTE =================


app.get(`/`, (a, b) => {
  b.render('index')
})


// lijhat data pojo bill
app.get(`/lihat-table-bill`, (a, b) => {
  let sql = `select * from bill limit 1`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send([{
        "info": false,
        "ket": err.message
      }])
    } else {
      b.send(data)
    }
  })
})



// // lihat table bill by nobill
// app.get(`/lihat-bill-bynobill/:nobill`, (a, b) => {
//   let sql = `select * from listbill where nobill="${a.params.nobill}"`;
//   db.query(sql, (err, data) => {
//     if (err) {
//       b.send(err.message)
//     } else {
//       b.send(data)
//     }
//   })
// })

// lihat table bill by nobill
app.get(`/lihat-bill-bynobill/:nobill`, (a, b) => {
  let sql = `select bill.*,produk.nama_pro,produk.kode_out from bill left join produk on bill.kode_pro = produk.kode_pro where bill.nobill ="${a.params.nobill}"`;
  //let sql = `select bill.cetak,bill.disc_nom,bill.disc_sen,bill.gross,bill.harga_pro,bill.jamor,bill.kD_WAITER,bill.kode_out,bill.kode_pro,bill.net,bill.nobill,bill.note,bill.qty,bill.tanggal,bill.tax,bill.urut,bill.vser,bill.vtax,bill.vts,produk.nama_pro from bill left join produk on bill.kode_pro = produk.kode_pro where bill.nobill = "${a.params.nobill}" and tanggal=date("2020-02-03")`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat data pojo listbill
app.get(`/lihat-table-listbill`, (a, b) => {
  let sql = `select * from listbill limit 1`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat table bill by nobill
app.get(`/lihat-listbill-bynobill/:nobill`, (a, b) => {
  let sql = `select * from listbill where nobill ="${a.params.nobill}"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat data pojo listmeja
app.get(`/lihat-table-listmeja`, (a, b) => {
  let sql = `select * from listmeja order by meja asc `;
  db.query(sql, (err, data) => {
    if (err) {
      b.send([{
        "info": false,
        "ket": err.message
      }])
    } else {
      b.send(data)
    }
  })
})

// lihat data pojo produk
app.get(`/lihat-table-produk`, (a, b) => {
  let sql = `select * from produk limit 1`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send([{
        "info": false,
        "ket": err.message
      }])
    } else {
      b.send(data)
    }
  })
})



// lihat data pojo waiter
app.get(`/lihat-table-waiter`, (a, b) => {
  let sql = `select * from waiter limit 1`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send([{
        "info": false,
        "ket": err.message
      }])
    } else {
      b.send(data)
    }
  })
})

// semua user
app.get(`/semua-user`, (a, b) => {
  let sql = `select kd_kasir,kd_sandi from kasir`
  db.query(sql, (err, data) => {
    if (err) {
      b.send([{
        "info": false,
        "ket": err.message
      }])
    } else {
      b.send([{
        "info": true,
        "ket": data
      }])
    }
  })
})

// lihat table bill
app.get(`/lihat-table-bill`, (a, b) => {
  let sql = `select * from bill`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// semua table

app.get(`/lihat-all-table`, (a, b) => {
  let sql = `show tables`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat meja booked
app.get(`/lihat-meja-booked`, (a, b) => {
  let sql = `select nobill,paidbill,kode_wait,kasir,meja,Lokasi from listbill where stt = "open"`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat semua meja isi
app.get(`/lihat-mejaisi`, (a, b) => {
  let sql = `select * from meja_isi`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// cek meja isi

app.get(`/cek-mejaisi/:meja`, (a, b) => {
  let sql;
  if (a.params.meja == "all") {
    sql = `select * from meja_isi`
  } else {
    sql = `select * from meja_isi where meja ="${a.params.meja}"`
  }

  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      if (data.length > 0) {
        b.send({
          "info": false,
          "ket": data
        })
      } else {
        b.send({
          "info": true,
          "ket": data
        })
      }
    }
  })
  //b.send("apa kabar")
})


// booking meja
app.post(`/booking-meja`, (a, b) => {
  let data = a.body;
  let sql = `insert into meja_isi (meja,lokasi,kd_out) values("${data.meja}","${data.lokasi}","${data.kd_out}")`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      console.log(data)
      b.send({
        "info": true
      })
    }
  })
})

// hapus booking meja
app.get(`/hapus-booking-meja/:meja`, (a, b) => {
  let meja = a.params.meja;
  let sql = `delete from meja_isi where meja = "${meja}"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send({
        "info": true
      })
    }
  })
})

// bersihkan booking meja
app.get(`/bersihkan-booking-meja`, (a, b) => {
  let sql = `truncate meja_isi`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send({
        "info": true
      })
    }
  })
})

// lihat semua customer
app.get(`/lihat-customer`, (a, b) => {
  let sql = `select * from customer where aktif = 1`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})


// lihat semua produk
app.get(`/lihat-semua-produk`, (a, b) => {
  let sql = `select * from produk limit 1`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat produk
app.get(`/lihat-produk`, (a, b) => {
  let sql = `select kode_pro,nama_pro,harga_pro,ccy,groupp from produk`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send({
        "info": false,
        "ket": err.message
      })
    } else {
      b.send(data)
    }
  })
})

// lihat produk food
app.get(`/lihat-produk-food`, (a, b) => {
  let sql = `select nama_pro,harga_pro,ccy,groupp from produk where groupp = "food"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat produk beverage
app.get(`/lihat-produk-beverage`, (a, b) => {
  let sql = `select nama_pro,harga_pro,ccy,groupp from produk where groupp = "beverage"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat produk other
app.get(`/lihat-produk-other`, (a, b) => {
  let sql = `select nama_pro,harga_pro,ccy,groupp from produk where groupp != "food" and groupp != "beverage"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})


// lihat produk by sub
app.get(`/lihat-produk-group`, (a, b) => {
  let sql = `select groupp from produk`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      var datanya = data.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.groupp.trim()).indexOf(obj.groupp.trim()) == pos;
      })
      b.send(datanya)
    }
  })
})

app.get(`/lihat-waiter`, (a, b) => {
  let sql = `select * from waiter`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat produk subgroup
app.get(`/lihat-produk-subgroup/:group`, (a, b) => {
  let sql = `select subgroupp from produk where groupp = "${a.params.group}"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      var datanya = data.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.subgroupp.trim()).indexOf(obj.subgroupp.trim()) == pos;
      })
      b.send(datanya)
    }
  })
})

// lihat produck by group and sub group
app.get(`/lihat-produk-group-sub/:group/:subgroup`, (a, b) => {
  let sql = `select kode_pro,nama_pro,harga_pro,ccy,groupp,subgroupp from produk where groupp = "${a.params.group}" and subgroupp = "${a.params.subgroup}"`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat meja
app.get(`/lihat-meja-open/:tanggal`, (a, b) => {
  var tgl = a.params.x
  let sql = `select *from listbill where tanggal = "${a.params.tanggal}" and stt ="open" `
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
  //b.send(tgl)
})


// lihat outlet
app.get(`/lihat-outlet`, (a, b) => {
  let sql = `select * from outlet where kode_out = "RST"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// login
app.post(`/login`, (a, b) => {
  let user = a.body.user;
  let pass = a.body.pass;
  let sql = `select * from waiter where nama_wait = "${user}"`
  let apa;
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      if (data[0].sandi.trim() == pass) {
        b.send({
          "info": true,
          "ket": data
        })
      } else {
        b.send({
          "info": false,
          "ket": "no user or pass"
        })
      }
    }
  })

  // let sql = `select * from kasir where waiter = "${user}" and kd_sandi = "${pass}"`;
  // db.query(sql,(err,data)=>{
  //   if(err){
  //     b.send({"info":false,"ket":err.message})
  //   }else{
  //     if(data.length != 0){
  //       b.send({"info":true,"ket":data})
  //     }else{
  //       b.send({"info":false,"ket":"user or pass is not match"})
  //     }

  //   }
  // })
})

// jam sekarang

app.get(`/tanggal-sekarang`, (a, b) => {
  console.log("mendapatkan tanggal")
  let sql = `select date_format(current_date(),'%Y-%m-%d') as tanggal,curtime() as jam`
  //let sql = `select date`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      console.log(`tanggal dikirim ${JSON.stringify(data)}`)
      b.send(data)
    }
  })
})


// live search cari prowduk
app.get(`/cari-produk/:produk`, (a, b) => {
  let sql;
  if (a.params.produk == "all") {
    sql = `select nama_pro,harga_pro,kode_pro from produk`;
  } else {
    sql = `select nama_pro,harga_pro,kode_pro from produk where nama_pro like "%${a.params.produk}%"`
  }

  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat outlet
app.get(`/lihat-outlet`, (a, b) => {
  let sql = `select outlet.*,c.tax,c.service,c.tax_print,c.ser_print from outlet left join configurasi c on outlet.kode_out = c.kode where kode_out = "rst" `
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})

// lihat listbill
app.get(`/lihat-meja-kosong/:tanggal`, (a, b) => {
  let sql = `select meja from listbill where tanggal = "2018-08-02"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})


//lihat bill by nobill
app.get(`/lihat-bill-bynobill/:nobill`, (a, b) => {
  let sql = `select * from bill where nobill = "${nobill}"`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})


// simpan table bill - listbill
app.post(`/simpan-bill-listbill`, (req, res) => {
  let bill = req.body["bill"]
  let listBill = req.body["listBill"]

  var kBill = Object.keys(bill[0])
  var kBill2 = []

  var valBill = ""
  var valBill2;

  var update = ""
  var update2;

  // pecah value
  for (var v = 0; v < bill.length; v++) {
    valBill += "(" + JSON.stringify(Object.values(bill[v])) + "),"
  }

  // pecah kunci
  for (var b = 0; b < kBill.length; b++) {
    kBill2.push("`" + kBill[b] + "`")
  }

  valBill2 = valBill.replace(/\[|\]|\,$/g, "")

  // pecah update
  for (u = 0; u < kBill2.length; u++) {
    update += `${kBill2[u]} = values(${kBill2[u]}),`
  }
  update2 = update.replace(/\,$/g, "")
  let sqlBill = `insert into bill(${kBill2}) values${valBill2}`

  var kListBill = Object.keys(listBill)
  var vListBill = Object.values(listBill)

  var kListBill2 = [];
  var updateListBill = ""
  var vListBill2 = JSON.stringify(vListBill).replace(/\[/g, "(").replace(/\]/g, ")")

  for (var x = 0; x < kListBill.length; x++) {
    kListBill2.push("`" + kListBill[x] + "`")
    updateListBill += "`" + kListBill[x] + "` = values(" + "`" + kListBill[x] + "`),"
  }

  let sqlListBill = `insert into listbill(${kListBill2}) values ${vListBill2}`

  db.beginTransaction((err) => {
    console.log("mulai transaksi bill dan list bill")
    if (err) {
      console.log("error transaksi bill dan list bill")
      b.send({
        "info": false,
        "ket": err.message
      })
      console.log(err.message)
    } else {
      //res.send(sqlBill)
      console.log("mulai simpan bill listbill")
      db.query(sqlBill, (err, data) => {
        if (err) {
          res.send({
            "info": false,
            "ket": err.message
          })
          console.log(err.message)
        } else {
          console.log("simpan bill")
          // kirim listbill
          db.query(sqlListBill, (err, data) => {
            if (err) {
              console.log("gagal simpan listbill")
              res.send({
                "info": false,
                "ket": err.message
              })
            } else {
              console.log("simpan listbill")
              // simpan jika tidak ada error
              db.commit((err) => {
                if (err) {
                  console.log("gagal commit")
                  return db.rollback(() => {
                    throw err;
                    res.send({
                      "info": false,
                      "ket": "transaksi gagal"
                    })
                  })
                }
                console.log("commit bill dan listbill")
                res.send({
                  "info": true
                })
                console.log("berhasil commit")
              })
            }


          })
        }


      })
    }


  })
})



// update table bill - listbill
app.post(`/update-bill-listbill`, (req, res) => {
  let bill = req.body["bill"]
  let listBill = req.body["listBill"]

  var kBill = Object.keys(bill[0])
  var kBill2 = []

  var valBill = ""
  var valBill2;

  var update = ""
  var update2;

  // pecah value
  for (var v = 0; v < bill.length; v++) {
    valBill += "(" + JSON.stringify(Object.values(bill[v])) + "),"
  }

  // pecah kunci
  for (var b = 0; b < kBill.length; b++) {
    kBill2.push("`" + kBill[b] + "`")
  }

  valBill2 = valBill.replace(/\[|\]|\,$/g, "")

  // pecah update
  for (u = 0; u < kBill2.length; u++) {
    update += `${kBill2[u]} = values(${kBill2[u]}),`
  }
  update2 = update.replace(/\,$/g, "")
  let sqlBill = `insert into bill(${kBill2}) values${valBill2} on duplicate key update ${update2}`

  var kListBill = Object.keys(listBill)
  var vListBill = Object.values(listBill)

  var kListBill2 = [];
  var updateListBill = ""
  var vListBill2 = JSON.stringify(vListBill).replace(/\[/g, "(").replace(/\]/g, ")")

  for (var x = 0; x < kListBill.length; x++) {
    kListBill2.push("`" + kListBill[x] + "`")
    updateListBill += "`" + kListBill[x] + "` = values(" + "`" + kListBill[x] + "`),"
  }

  let sqlListBill = `insert into listbill(${kListBill2}) values ${vListBill2} on duplicate key update ${updateListBill.replace(/\,$/g,"")}`

  db.beginTransaction((err) => {
    console.log("mulai transaksi update bill dan list bill")
    if (err) {
      console.log("error update transaksi bill dan list bill")
      b.send({
        "info": false,
        "ket": err.message
      })
    } else {
      //res.send(sqlBill)
      db.query(sqlBill, (err, data) => {
        if (err) {
          res.send({
            "info": false,
            "ket": err.message
          })
        } else {
          console.log("update bill")
          // kirim listbill
          db.query(sqlListBill, (err, data) => {
            if (err) {
              console.log("gagal update listbill")
              res.send({
                "info": false,
                "ket": err.message
              })
            } else {
              console.log("update listbill")
              // simpan jika tidak ada error
              db.commit((err) => {
                if (err) {
                  console.log("gagal update commit")
                  return db.rollback(() => {
                    res.send({
                      "info": false,
                      "ket": "transaksi update bill listbill gagal"
                    })
                    throw err;
                  })
                }
                console.log("commit update bill dan listbill")
                res.send({
                  "info": true
                })
                console.log("berhasil commit update bill listbill")
              })
            }


          })
        }


      })
    }


  })
})


app.post(`/simpan-listbill`, (a, b) => {
  var ky2 = [];
  let ky = Object.keys(a.body)
  let val = JSON.stringify(Object.values(a.body)).split(`[`).join("").split(`]`).join("")

  for (var i = 0; i < ky.length; i++) {
    ky2.push("`" + ky[i] + "`");
  }
  let sql = `insert into listbill(${ky2}) values(${val})`
  db.query(sql, (err, data) => {
    if (err) {
      b.send({
        "info": false,
        "ket": err.message
      })
      console.log(`simpan listbill gagal ket : ${err.message}`)
    } else {
      b.send({
        "info": true
      })
      console.log("simpan listbill sukses")
    }
  })
  //b.send(val)
})

// simpan bill
app.post(`/simpan-bill`, (a, b) => {

  var ky2 = [];
  let ky = Object.keys(a.body)
  let val = JSON.stringify(Object.values(a.body)).split(`[`).join("").split(`]`).join("")
  for (var i = 0; i < ky.length; i++) {
    ky2.push("`" + ky[i] + "`");
  }
  let sql = `insert into bill(${ky2}) values(${val})`
  db.query(sql, (err, data) => {
    if (err) {
      b.send({
        "info": false,
        "ket": err.message
      })
      console.log(`simpan bill gagal ${err.message}`)
    } else {
      b.send({
        "info": true
      })
      console.log(`$simpan bill sukses`)
    }
  })

})

// hapus dari table bill
app.get(`/hapus-bill/:nobill`, (a, b) => {
  let sql = `delete from bill where nobill ="${a.params.nobill}"`;
  db.query(sql, (err, data) => {
    if (err) {
      b.send({
        "info": false,
        "ket": err.message
      })
    } else {
      b.send({
        "info": true
      })
    }
  })
})



// simpan table sementara
app.post(`/simpan-tsementara`, (a, b) => {

  //let ky = Object.keys(a.body[0])
  //let val = JSON.stringify(Object.values(a.body)).replace(/\[|\]/g,"")

  //let sql = `insert into tsementara(${ky}) values(${val})`
  // var val = ``

  // for(var i=0;i<a.body.length;i++){
  //   val += JSON.stringify(Object.values(a.body[i]))
  // }
  // let apa =  val.replace(/\[/g,"(").replace(/\]\(/g,"),(").replace(/\]/g,")")

  // let sql = `insert into tsementara(${ky}) values${apa}`

  //b.send(sql)
  // db.query(sql,(err,data)=>{
  //     if(err){
  //       b.send({"info":false,"ket":err.message})
  //     }else{
  //       b.send({"info":true})
  //     }
  // })

  // db.query(sql,(err,data)=>{
  //   if(err){
  //     b.send({"info":false,"ket":err.message})
  //   }else{
  //     b.send({"info":true})
  //   }
  // })
})

app.get(`/buat-table-sementara`, (a, b) => {
  let sql = `create table tsementara(id int primary key auto_increment,nama varchar(255),umur int(255))`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send({
        "info": true
      })
    }
  })
})


// ping
app.get(`/ping`, (a, b) => {
  let sql = `select 1`
  db.query(sql, (err, data) => {
    if (err) {
      b.send(err.message)
    } else {
      b.send(data)
    }
  })
})




app.get('*', (a, b) => {
  b.send("hidup gk semudah cocote mario teguh ok")
})

// ======= run server ========
setInterval(function () {
  db.query('SELECT 1');
}, 1000);

app.listen(PORT, () => {
  console.log(`app run on port : ${PORT}`)
})

```

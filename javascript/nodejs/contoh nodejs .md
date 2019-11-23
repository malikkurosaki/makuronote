# contoh node js 

```javascript
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mysql = require('mysql')
const parser = require('body-parser')
const admin = require('firebase-admin')
const https = require('https')

const serviceAccount = require("./firebase_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kitasehat-3f899.firebaseio.com"
});

const db = mysql.createConnection({
  host:"bestmedialearning.com",
  user:"u6045499_apibest",
  password:"makuro123",
  database:"u6045499_kitasehat"
})

/*
table komenan
id,komen,dari,posisi
*/
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

app.set('view engine','pug')
app.set('views','./views')

app.get('/',(req,res)=>{
  res.render('index',{
    title:"kita sehat"
  })
})

app.post('/api/hapus',(a,b)=>{
  let apa = a.body
  let sql = `delete from content_sehat where id = "${apa.hapus}"`
  let query = db.query(sql,(aa,bb)=>{
    b.send(bb)
  })
})

app.post('/api/newpost',(req,res)=>{
  var terima = req.body
    let sql = `insert into content_sehat(id,judul,isi) values(null,"${terima.title}","${terima.body}")`
    let query = db.query(sql,(c,d)=>{
      if(c)throw c

      //payload
      var payload = {
        notification: {
            title:terima.title,
            body:terima.body,
            sound: "default",
        },
        data:{
            title:terima.title,
            body:terima.body,
            extra:"halo"
        }
    }

    admin.messaging().sendToTopic("berita",payload).then((response) => {
    // Response is a message ID string.
          res.send(response)
      }).catch((error) => {
          res.send(error)
      });
    })  
})

app.get('/api/content',(a,b)=>{
  let terima = a.body
  let sql = 'select * from content_sehat order by id'
  let query = db.query(sql,(c,d)=>{
    if(c)throw c
    b.send(d)
  })
})

app.get('/api/user/komen',(a,b)=>{
  let sql = `select * from komenan`
  let query = db.query(sql,(c,d)=>{
    if(c)throw c
    b.send(d)
  })
})

app.post('/api/user/komen',(a,b)=>{
  let param = a.body
  let komen = param.komen
  let dari = param.dari
  let posisi = param.posisi
  let sql = `insert into komenan(id,komen,dari,posisi) values(null,"${komen}","${dari}","${posisi}")`
  let query = db.query(sql,(c,d)=>{
    if(c)throw c
    b.send([{"pesan":"berhasil menambahkan komentar"}])
  })
})

setInterval(()=>{
  db.query('select 1')
  https.get('https://kitasehat.herokuapp.com/')
},1000)
app.listen(PORT,()=>{
  console.log(`app run on port : ${PORT}`)
})
```

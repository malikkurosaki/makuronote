# simpan multiple json ke mysql tanpa looping

```javascript
// simpan table sementara
app.post(`/simpan-tsementara`,(a,b)=>{
  let ky = Object.keys(a.body[0])
  //let val = JSON.stringify(Object.values(a.body)).replace(/\[|\]/g,"")

  //let sql = `insert into tsementara(${ky}) values(${val})`
  var val = ``

  for(var i=0;i<a.body.length;i++){
    val += JSON.stringify(Object.values(a.body[i]))
  }
  let apa =  val.replace(/\[/g,"(").replace(/\]\(/g,"),(").replace(/\]/g,")")

  let sql = `insert into tsementara(${ky}) values${apa}`

  //b.send(sql)
  db.query(sql,(err,data)=>{
      if(err){
        b.send({"info":false,"ket":err.message})
      }else{
        b.send({"info":true})
      }
  })
  
  db.query(sql,(err,data)=>{
    if(err){
      b.send({"info":false,"ket":err.message})
    }else{
      b.send({"info":true})
    }
  })
})

```

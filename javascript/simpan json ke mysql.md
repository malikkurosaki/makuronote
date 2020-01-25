# simpan json ke mysql

```javascript
// buat table sementara
app.post(`/simpan-tsementara`,(a,b)=>{
  let ky = Object.keys(a.body)
  let val = JSON.stringify(Object.values(a.body)).split(`[`).join("").split(`]`).join("")

  let sql = `insert into tsementara(${ky}) values(${val})`
  
  db.query(sql,(err,data)=>{
    if(err){
      b.send(sql)
    }else{
      b.send(data)
    }
  })
})
```

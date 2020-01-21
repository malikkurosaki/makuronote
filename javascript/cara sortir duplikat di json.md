# sortir duplikat di json

```javascript
// lihat produk by sub
app.get(`/lihat-produk-group`,(a,b)=>{
  let sql = `select groupp from produk`
  db.query(sql,(err,data)=>{
    if(err){
      b.send(err.message)
    }else{
      var datanya = data.filter((obj,pos,arr)=>{
        return arr.map(mapObj => mapObj.groupp.trim()).indexOf(obj.groupp.trim()) == pos;
      })
      b.send(datanya)
    }
  })
})

```

# insert data json langsung ke mysql

```javascript
app.post(`/simpan-lsbill`,(a,b)=>{
  var ky2 = [];
  let ky = Object.keys(a.body)
  let val = JSON.stringify(Object.values(a.body)).split(`[`).join("").split(`]`).join("")

  for(var i = 0;i<ky.length;i++){
    ky2.push("`"+ky[i]+"`");
  }
  let sql = `insert into listbill(${ky2}) values(${val})`
  db.query(sql,(err,data)=>{
    if(err){
      b.send({"info":false,"ket":err.message})
    }else{
      b.send({"info":true})
    }
  })
  //b.send(val)
})
```

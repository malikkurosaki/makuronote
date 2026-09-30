<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [simpan json ke mysql](#simpan-json-ke-mysql)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

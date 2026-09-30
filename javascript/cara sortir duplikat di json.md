<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [sortir duplikat di json](#sortir-duplikat-di-json)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

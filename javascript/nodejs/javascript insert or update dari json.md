<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [javasript insert or update dari json](#javasript-insert-or-update-dari-json)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# javasript insert or update dari json

```javascript
// update table bill
app.post(`/update-bill`,(req,res)=>{
  let kunci = Object.keys(req.body)
  var kunci2 = []
  let val = Object.values(req.body)
  var val3 = JSON.stringify(val).replace(/\[|\]/g,"")
  var val4 = val3.split(",")
  var update = ''

  for(var i = 0;i<kunci.length;i++){
    kunci2.push("`"+kunci[i]+"`");
  }

  for(var x = 0;x<kunci2.length;x++){
    update += `${kunci2[x]} = ${val4[x]},`
  }

  let sql = `insert into bill(${kunci2}) values(${val4}) on duplicate key update ${update.replace(/,$/g,"")}`

  res.send(sql)
})
```

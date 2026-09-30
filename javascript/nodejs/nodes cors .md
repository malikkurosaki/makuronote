<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [mengadakan cors pada nodejs](#mengadakan-cors-pada-nodejs)
    - [install](#install)
    - [adakan semua cors](#adakan-semua-cors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mengadakan cors pada nodejs

### install

`$ npm install cors`

### adakan semua cors

```javascript
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```

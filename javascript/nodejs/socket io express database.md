# socket io , express , database

server.js

```js

const express = require('express')
const app = express()
const router = express.Router()
const http = require('http').createServer(app)
var cors = require('cors')
const io = require('socket.io')(http,{
    transports: ['polling','websocket'],
    cors: {
        origin: "*",
        methoth: ["GET", "POST"]
    }
})
app.use(cors())
app.use(router)

io.on('connection',(socket) => {
    socket.on('apa', (data) => {
        io.emit('apa',data)
        console.log(data)
    })
})

http.listen(5000,() => {
    console.log('socket run on port : 5000')
})


module.exports = { io, router}

```

db.js

```js
const {DataTypes,Sequelize,Model} = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
})

class Users extends Model{}
Users.init(
    {
        namaDepan: DataTypes.STRING,
        namaBelakang: DataTypes.STRING
    },
    {sequelize}
)

;(async () => {
    await sequelize.sync()
})()

module.exports = {Users}

```

index.html

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="./public/socket.io.min.js"></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.min.js"></script> -->

</head>
<body>
    <div id="ini">ini</div>
    <button id="abis">abisapa</button>
    <script>
        var Io = io("http://localhost:5000");
        console.log("coba")
        Io.emit('apa',"apa kabar")
        Io.on('apa',(data) => {
            if(data == "update"){
                $.get('http://localhost:5000/apa',(a,b)=>{
                    console.log(a)
                })
            }
        })

        $('#abis').click(()=>{
            Io.emit('apa','update')
        })


    </script>

</body>
</html>

```

index.js

```js
const router = require('./router')




```

package.json

```json
{
  "name": "myproject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-async-handler": "^1.1.4",
    "nodemon": "^2.0.6",
    "sequelize": "^6.3.5",
    "socket.io": "^3.0.3",
    "socket.io-json-parser": "^2.1.1",
    "socket.io-msgpack-parser": "^3.0.1",
    "sqlite3": "^5.0.0"
  }
}
```

router.js

```js
const { router } = require('./server')
const { Users } = require('./db')
const asyncHandler = require('express-async-handler')

router.get('/', asyncHandler(async (a,b) => {
    b.send("apa kabarnya")
}))

router.get('/apa', asyncHandler(async (a,b) => {
    const semua = await Users.findAll();
    b.send(semua)
}))

router.get('/simpan',asyncHandler(async (a,b) =>{
    const malik = await Users.create({namaDepan:"ayu",namaBelakang: "elek"})
    b.send(malik)
}))

module.exports = {
    route: router
}
```

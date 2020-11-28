# server socket io

package.json

```json
{
    "name": "malikkurosaki_realtime_server",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "malikkurosaki",
    "license": "ISC",
    "dependencies": {
      "express": "4.17.1",
      "express-async-handler": "1.1.4",
      "multer": "1.4.2",
      "sequelize": "6.3.5",
      "socket.io": "3.0.3",
      "sqlite": "4.0.15",
      "body-parser": "1.19.0",
      "cors": "2.8.5",
      "auto-load": "3.0.4",
      "sqlite3": "5.0.0"
    },
    "devDependencies": {},
    "description": ""
  }
  
```


index.js
```js
const { router } = require('./router')


const req = [
    "resize-image-buffer",
    "sequelize",
    "multer",
    "express",
    "body-parser",
    "cors",
    "sqlite",
    "resize-image-buffer"
]
```

router.js

```js
const { router } = require('./server')
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const upload = multer({dest: './public/assets/images/'})

const users = require('./controller/user_controller')
const gambar = require('./controller/gambar_controller')

router.get('/', asyncHandler(async (a,b) => {
    b.send("apa kabarnya")
}))

/* user router */
router.get('/lihat-user',asyncHandler(users.lihat))
router.post('/hapus-user',asyncHandler(users.hapus))
router.post('/tambah-user',asyncHandler(users.tambah))
router.post('/update-user',asyncHandler(users.update))

/* gambar router */
router.post('/tambah-gambar',upload.single('gambar'), asyncHandler(gambar.tambah))
router.get('/lihat-semua-gambar',asyncHandler(gambar.lihat))
router.post('/hapus-gambar', asyncHandler(gambar.hapus))
router.post('/update-gambar', asyncHandler(gambar.update))

module.exports = { router }

```

server.js

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router()
const http = require('http').createServer(app)
const PORT = 8080
var cors = require('cors')

const io = require('socket.io')(http,{
    transports: ['websocket','polling'],
    cors: {
        origin: "*",
        methoth: ["GET", "POST"]
    }
})

io.on('connection',(socket) => {
    console.log('socket connected')
    socket.on('apa', (data) => {
        io.emit('apa',data)
        console.log(data)
    })
})

app.use(cors())
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(router)

http.listen(PORT,"192.168.192.188",() => {
    console.log('socket & server run on port : '+PORT)
})
module.exports = { io, router}

```

database.js

```js
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
})

;(async () => {
    //await sequelize.sync({force: true})
})()

module.exports = { sequelize }

```

user_model.js

```js

const { DataTypes,Model, Sequelize } = require('sequelize')
const { sequelize } = require('./../database')

class UsersModel extends Model{}
UsersModel.init(
    {
        nama_depan: DataTypes.STRING,
        nama_belakang: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: DataTypes.STRING,
        uuid: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }
    },
    {sequelize}
)

module.exports = { UsersModel }

```

gambar_model.js

```js
const { DataTypes,Model } = require('sequelize')
const { sequelize } = require('./../database')

class GambarModel extends Model{}
GambarModel.init({
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama: DataTypes.STRING,
    gambar: DataTypes.STRING
},{sequelize})

module.exports = { GambarModel }
```

user_controller.js

```js
const { UsersModel } = require('./../model/user_model')
const { io } = require('./../server')
const mdl = {}

// lihat
async function lihat(req, res){
    const lihat = await UsersModel.findAll()
    res.send(lihat)
}

// tambah
async function tambah(a,b,c){
    try {
        const tam = await UsersModel.create(a.body)
        b.send(tam)
    } catch (error) {
        b.send(
            error.errors[0].message == "email must be unique"?
            "email has taken": error
        )
    }
}

// hapus
async function hapus(a,b,c){
    let hapus = UsersModel.destroy({
        where: {
            uuid: a.body.uuid
        }
    })
    b.send(a.body.uuid)
}


/* 
    {
        "data": {
            "nama": "malik"
        },
        "id": {
            "id": 20
        }
    }
*/

// update
async function update(a,b,c){
    let update = UsersModel.update(a.body.data,{where: a.body.id})
    b.send(update)
}




mdl.lihat = lihat
mdl.tambah = tambah
mdl.hapus = hapus
mdl.update = update

module.exports = mdl
```

gambar_controller.js

```js
const { GambarModel } = require('./../model/gambar_model')
const { io } = require('./../server')
var resize = require('resize-image-buffer');
const mdl = {}


async function lihat(req,res){
    const data = await GambarModel.findAll()
    res.send(data)
}

async function tambah(req,res){
    const paket = {
        nama: req.file.originalname,
        gambar: req.file.filename,
        uuid: req.file.originalname
    }
    const data = await GambarModel.create(paket)
    res.send(data)
}

async function hapus(req,res){
    let data = await GambarModel.destroy({
        where: {
            "id": req.body.id
        }
    })
    res.send(req.body.id)
}

async function update(req,res){
    const data = await GambarModel.update(req.body.data,{
        where: req.body.id
    })
    res.send(data)
}

mdl.lihat = lihat
mdl.tambah = tambah
mdl.hapus = hapus
mdl.update = update

module.exports = mdl

```


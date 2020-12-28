_tambahan.js_

```js
`use strict`

const { Model, Op, DataTypes } = require("sequelize");

class Tambahan extends Model{
    static type = DataTypes;

    static async lihatSemua(){
        try {
            const data = await this.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async lihatSatu(id){
        try {
            const data = await this.findOne({
                where: {
                    id: id
                }
            })
            return data;
        } catch (error) {
            console.log(error);
            
            return {error: true, message: error};
        }
    }

    static async lihatSatuRouter(req, res){
        const data = await this.lihatSatu(req.params.id);
        res.send(data.error? {status: false, message: data.message}: data);
    }


    static async temukan(id){
        try {
            const data = await this.findAll({
                where: {
                    id: id
                }
            })
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async temukanRouter(req, res){
        const data = await this.temukan(req.params.id);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async cari(val){
        try {
            const data = await this.findAll({
                where: {
                    name: {
                        [Op.substring]: val
                    }
                }
            })
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async cariRouter(req, res){
        const data = await this.cari(req.params.name);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async simpan(val){
        try {
            const data = await this.create(val);
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async simpanRouter(req, res){
        const data = await this.simpan(req.body.data);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async update(val, id){
        try {
            const data = await this.update(val,{
                where: {
                    id: id
                }
            })

            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async updateRouter(req, res){
        const data = await this.update(req.body.data, req.body.id);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async updateAtauSimpan(val){
        try {
            const data = await this.upsert(val);
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async updateAtauSimpanRouter(req, res){
        const data = await this.updateAtauSimpan(req.body.data);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async hapus(id){
        try {
            const data = await this.destroy({
                where: {
                    id: id
                }
            })
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async hapusRouter(req, res){
        const data = await this.hapus(req.body.id);
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async bersihkan(){
        try {
            const data = await this.destroy({
                truncate: true
            })

            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async bersihkanRouter(req, res){
        const data = await this.bersihkan();
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async terangkan(){
        try {
            const data = await this.describe();
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async terangkanRouter(req, res){
        const data = await this.terangkan();
        res.send(data.error? {status: false, message: data.message}: data);
    }

    static async aktifkan(){
        try {
            const data = await this.sync();
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }

    static async aktifkanForce(){
        try {
            const data = await this.sync({force: true});
            return data;
        } catch (error) {
            console.log(error);
            return {error: true, message: error};
        }
    }
}


class Tempelan extends Tambahan{
    static async lihatSemuaRouter(req, res){
        const data = await Tambahan.lihatSemua();
        res.send(data.error? {status: false, message: data.message}: data)
    }
}

exports = { Tambahan, Tempelan }

```

_server.js_

```js
import { from } from 'form-data';
const express = require('express');
const router = express.Router();
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const body = require('body-parser');
const handler = require('express-async-handler');
// const { Tempelan } = require('./tambahan');
// const { Pengguna } = require('./models/pengguna');
// import { Pengguna } from './models/pengguna';

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['get', 'post']
    }
});


const workspaces = io.of(/^\/\w+$/);
workspaces.on('connection', socket => {
    const workspace = socket.nsp;
    console.log(workspace.name);

    socket.on("pesan", pesan => {
        workspaces.emit("pesan", pesan)
    })
})



// io.on('connection', socket => {
//     socket.on('pesan', pesan => {
//         io.emit('pesan', pesan);
//     })
// })



app.use(cors());
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('./views'));
app.use(express.json());
app.use(body.urlencoded({extended: true}));
app.use('/api', router);


// app.get('/', handler( Pengguna.lihatSemuaRouter ))


exports = { router, http }
```

_index.js_

```js
'use strict'
import { from } from "form-data";
import { http } from './server';
const { router } = require('./routers');

http.listen(8000, () => console.log('server run on port : 8000'));
```

_db.js_

```js
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
})

module.exports = { sequelize }

```

_pengguna.js_

```js
'use stric'

const { DataTypes, Model, Op, Sequelize} = require('sequelize');
const { Tambahan, Tempelan } = require('../tambahan');

const { sequelize } = require('./../db');
const { Jabatan } = require('./jabatan');

class Pengguna extends Tempelan{
    
    static fake = {
        "name": Math.random().toString(26).substring(2),
        "email": Math.random().toString(26).substring(2)+"@gmail.com",
        "password": Math.random().toString(26).substring(2)
    }

    static async lihatJabatan(){
        try {
            const data = await this.findAll({
                include: [
                    {
                        model: Jabatan
                    }
                ]
            })
            return data;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

}

Pengguna.init({
    name: {
        type: Pengguna.type.STRING,
        allowNull: false
    },
    email: {
        type: Pengguna.type.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Pengguna.type.STRING,
        allowNull: false
    },
    kunci: {
        type: Pengguna.type.UUID,
        defaultValue: Sequelize.UUIDV4
    }
}, {underscored: true, sequelize})

Pengguna.hasMany(Jabatan)
Jabatan.belongsTo(Pengguna)
exports = { Pengguna };
```




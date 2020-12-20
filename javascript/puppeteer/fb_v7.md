### index.js

```js
const router = require('./server').router
const autoload = require('auto-load');
autoload('./routers')


//router.get('*', (req, res) => res.send('<h1>404</h1><br>hayo nyari apa, gk ada kayanya'))
```

### server.js

```js
const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').createServer(app);
const cors = require('cors');
const port = 8000;
const parser = require('body-parser')
const formdata = require('express-form-data');
const os = require('os');
const { Socket } = require('socket.io');
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        method: ['post', 'get']
    }
})

app.use(cors());
app.use(router);
app.use(express.json());
app.use(express.static('./public'))
app.use('/api',router);
//app.use(formdata.parse({uploadDir: os.tmpdir(),autoClean: true}))
app.use(parser.json());
app.use(parser.urlencoded({extended: false}))

// router.get('/', (req, res) => res.sendFile('./public/index.html',{root: '.'}));
router.get('/', (req, res) => res.send("apa kabar"));


http.listen(port, x => {
    console.log('\n server run on port : '+port+'\n')
})

io.on('connection', socket => {
    console.log("connection socket io")
    socket.on('message', message => {
        io.emit('message', message)
    })
})

module.exports = { router, io }

```

### db.js

```js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false
})

;( async () => {
    sequelize.sync()
})()

module.exports = { sequelize }

```

### controller/controller_activity_user.js

```js
const { default: Axios } = require('axios');
const { UserActif } = require('./../models/user_activ')

class ControllerUserActiv{
    static async addOrUpdate(req, res){
        try {
            let data = await UserActif.upsert(req.body);
            res.send({
                status: true,
                data: data,
                message: "user success update"
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }
    static async getUserActive(req, res){
        try {
            const data = await UserActif.findOne({
                where: {
                    id: 1
                }
            })
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: true,
                message: error
            })
        }
    }
}

module.exports = { ControllerUserActiv }
```

### controller/controller_facebook.js

```js
const { Facebook } = require('../facebook/facebook')
const { Group } = require('../models/group')

class ControllerFacebook{
    static async addOrUpdate(req, res){
        try {
            const data = await Group.bulkCreate(req.body,{
                updateOnDuplicate: ['user_id', 'group_id']
            })

            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async getGroupByUser(req, res){
        try {
            const data = await Group.findAll({
                where: {
                    user_id: req.params.user_id
                }
            })

            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async login(req, res){
        try {
            Facebook.login(req.params.id)
            res.send({
                status: true
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async updateGroup(req, res){
        try {
            await Facebook.ambilListGroup(req.params.id);
            res.send({
                status: true
            })
        } catch (error) {
            console.log(error)
            req.send({
                status: false,
                message: error
            })
        }
    }

    static async tambahGroup(req,res){
        try {
            await Facebook.tambahGroup(req.params.id, req.params.search)
            res.send({
                status: true
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }
}

module.exports = { ControllerFacebook }

```

### controller/controller_gambar.js

```js
const { Gambar } = require('./../models/gambar');
const fs = require('fs');

class ControllerGambar {
    static async create(req, res){
        const paket = {
            "user_id": req.headers.user_id,
            "name": req.file.originalname,
            "data": req.file.buffer
        }

        try {
            const data = await Gambar.create(paket);
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
        
    }

    static async findAll(req, res){
        try {
            const data = await Gambar.findAll({
                attributes: ['id', 'user_id', 'name']
            })
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
    }

    static async findWhere(req, res){
        try {
            let data = await Gambar.findAll({
                attributes: ['id','user_id', 'name'],
                where: {
                    user_id: req.params.id
                }
            })
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async update(req, res){
        try {
            const data = await Gambar.update(req.body.data,{
                where: {
                    id: req.body.id
                }
            })
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
    }

    static async delete(req, res){
        try {
            const id = req.body.id
            const data = await Gambar.destroy({
                where: {
                    id: id
                }
            })
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async lihatGambar(req, res){
        try {
            const data = await Gambar.findOne({
                where: {
                    user_id: req.params.user_id,
                    name: req.params.name
                }
            })

            res.writeHead(200,{
                'Content-Type': 'image/png',
                'Content-Length': data.data.length
            })

            res.end(data.data)
        } catch (error) {
            const data = fs.readFileSync(__dirname+'/../assets/images/gambar.png')
            res.writeHead(200,{
                'Content-Type': 'image/png',
                'Content-Length': data.length
            })
            res.end(data)
        }
    }
}

module.exports = { ControllerGambar }
```

### controller/controller_property.js

```js
const { Property } = require('./../models/property')


class ControllerProperty{

    static async addOrUpdate(req, res){
        //res.send(req.body)
        try {
            const data = await Property.upsert(req.body);
            res.send({
                status: true,
                data: data,
                message: 'data save succcessfuly'
            })
        } catch (error) {
            console.log(error)
            res.send({
                status: false,
                message: error
            })
        }
    }

    static async getProperty(req, res){
        try {
            let data = await Property.findAll()

            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error
            })
        }
    }
}

module.exports = { ControllerProperty }

```

### controller/controller_user.js

```js
const { User } = require('../models/user')

class ControllerUser{
    static async add(req, res){
        try {
            const data = await User.create(req.body);
            res.send({
                status: true,
                data: data,
                message: "user add successfuly"
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
        
    }

    static async findAll(req, res){
        try {
            const data = await User.findAll();
            res.send({
                status: true,
                data: data
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
    }

    static async update(req, res){
        try {
            const data = await User.update(req.data, {
                where: {
                    id: req.body.id
                }
            })
        } catch (error) {
            
        }
    }

    static async delete(req, res){
        try {
            const data = await User.destroy({
                where: {
                    id: req.body.id
                }
            })

            res.send({
                status: true,
                data: data,
                message: "user delete successfuly"
            })
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
        console.log('istance delete user')
    }

}

module.exports = { ControllerUser }

```


### facebook/facebook.js

```js
const puppeteer = require('puppeteer');
const { UserActif } = require('../models/user_activ');
const { Group } = require('./../models/group');
// const io = require('./../server').io;
const io = require('socket.io-client')('http://localhost:8000')


class Facebook {
    static alamatGroup = 'https://mbasic.facebook.com/groups/?seemore'
    static alamatLogin = 'https://mbasic.facebook.com/login.php'
    static tunggu = {waitUntil: 'networkidle2', timeout: 5000}

    static async userNya(){
        const user = await UserActif.findOne({
            where: {
                id: 1
            }
        })
        return user;
    }

    static async options(id){
        
        //const dirNya = id == undefined ?`./facebook/user/${user.id}`:`./facebook/user/${id}`;
        const op = {
            headless: false,
            userDataDir: `./facebook/user/${id}`,
            //devtools: true,
            ignoreHTTPSErrors: true,
            //args: ["--no-sandbox"],
            defaultViewport: {
            width: 500,
            height: 720,
            }
        }

        return op;
    }

    static async ambilListGroup(id){
        console.log(id)
        //const user = await this.userNya();
        const opt = await this.options(id)

        const browser = await puppeteer.launch(opt);
        const pages = await browser.pages();
        const page = pages[0];
        await page.goto(this.alamatGroup)

        const sudah = []
        console.log("coba melihat data group");
        const link = await page.evaluate(async (id) => {
            const a = document.querySelectorAll("table > tbody > tr > td > a")
            var hasil = []
            for(let y = 1; y< a.length;y++){
            
                if(a[y].href.includes("https://m.facebook.com/groups/")){
                    hasil.push(
                        {
                            "name":a[y].innerText,
                            "href": a[y].href,
                            "user_id": id,
                            "group_id": `${a[y].href.match(/groups\/.*\//g).toString().replace('groups/','').replace('/','')}`
                        }
                    )
                }
            }
            return hasil;
        },id);

        try {
            const hap = await Group.destroy({
                where: {
                    user_id: id
                }
            })
        } catch (error) {
            console.log(error)
        }
        
        try {
            const dat = await Group.bulkCreate(link,{
                updateOnDuplicate: ['user_id', 'group_id']
            })

            console.log('data disimpan ke database')
        } catch (error) {
            console.log({
                status: true,
                message: error
            })
        }

        io.emit('message', 'user');
        browser.close();
    }

    static async lihatGroup(){
        try {
            const data = await Group.findAll();
            console.log(JSON.stringify(data, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    static async login(id){
        //console.log(id)
        const browser = await puppeteer.launch(await this.options(id));
        try {
            const pages = await browser.pages();
            const page = pages[0];
            await page.goto(this.alamatLogin)
        } catch (error) {
            console.log(error)
        }

        process.on("unhandledRejection", () => {
            console.log('rejection')
            browser.close()
        });
    }


    static async tambahGroup(id, kunci){
        const usr = await this.userNya();
        const user = usr.name;

        let browser = await puppeteer.launch(await this.options(id))
        let pg = await browser.pages()
        let page = pg[0]
        await page.goto("https://mbasic.facebook.com/search/groups/?q="+kunci)
        await page.waitForTimeout(3000)
      
        const sudah = []
        const berapa = 100
        var banyak = 30;
      
        for(var x = 0; x < berapa; x++){
          try {
            const link = await page.evaluate( async (...sudah) => {
              const a = document.querySelectorAll("table > tbody > tr > td > div > a")
              var hasil = []
              for(let y = 1; y< a.length;y++){
                if(a[y].innerText == "Gabung"){
                  hasil.push(
                    {
                      "nama":a[y].innerText,
                      "alamat": a[y].href,
                      "nomer":y
                    }
                  )
                }
              }
              return hasil;
            },...sudah);
      
            sudah.push(...link)
      
            await page.$x('//span[contains(text(),"Lihat Hasil Selanjutnya")]').then( e => {e[0].click()});
            await page.waitForTimeout(3000)
            console.log(`lanjut page ${x}`);
          } catch (error) {
            x = berapa;
            console.log("selesai mencari total "+ sudah.length)
            console.log(JSON.stringify(error))
          }

          process.on("unhandledRejection", () => {
            console.log('rejection')
            browser.close()
          });
        }
      
        console.log(sudah.length)
        for(var i = 0; i < sudah.length; i++){
          if(i < banyak){
            try {
              await page.goto(sudah[i]['alamat']);
      
              await page.waitForTimeout(2000)
              console.log("lanjut minta ke group next")
            } catch (error) {
              console.log(error)
            }
          }else{
            i =  sudah.length
            console.log('selesai')
            console.log("selesai tambah group")
            io.emit('message', 'user');
          }
        }
        browser.close();
      }   

      static async posting(id){
        const gr = await Group.findAll({
          where: {
            user_id: id
          }
        })

        console.log(JSON.stringify(gr))
      }
}



module.exports = { Facebook }

```

### models/gambar.js

```js
const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('./../db');

class Gambar extends Model{}
Gambar.init({
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    data: DataTypes.BLOB
},{ sequelize })




;(async () => { Gambar.sync({force: false})})();

module.exports = { Gambar }

```

### models/group.js

```js
const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('./../db')

class Group extends Model{
    static async lihatSemuaGroupId(){
        try {
            const data = await this.findAll({
                attributes: ['group_id']
            })
            return {
                status: true,
                data: data
            }
        } catch (error) {
            return {
                status: false,
                message: error
            }
        }
    }
}
Group.init({
    group_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    href: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize })


module.exports = { Group }

```

### models/kegiatan.js

```js
const { DataTypes, Model, Sequelize }  = require('sequelize');
const { sequelize } = require('./../db')

class Kegiatan extends Model{}
Kegiatan.init({
    tanggal: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        defaultValue: Sequelize.DATEONLY
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize })

Kegiatan.cariSemua = async () => {
    try {
        const data = await this.Kegiatan.findAll();
        return {
            status: true,
            data: data
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

Kegiatan.simpan = async (values) => {
    try {
        const data = await this.Kegiatan.upsert(values);
        return {
            status: true,
            data: data
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}



module.exports = { Kegiatan }
```

### models/property.js

```js
const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('./../db')

class Property extends Model{}
Property.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    harga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize })

;(async x => Property.sync({force: false}));

module.exports = { Property }

```

### model/user_activity.js

```js
const {DataTypes, Model } = require('sequelize')
const { sequelize } = require('./../db')

class UserActif extends Model{}
UserActif.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER
}, { sequelize })

;(async x => {
    UserActif.sync({force: false})
})()

module.exports = { UserActif }

```

### models/user.js

```js
const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('./../db')

class User extends Model{}
User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{sequelize})

;(async () => User.sync({force: false}))()

module.exports = { User }

```

### public/index.html

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js"></script>
    <style>
        
    </style>
</head>
<body>
    <h1>Apa Kabar</h1>

    <div class="container-fluid">
        
        <div class="m-2 p-2 bg-light d-flex flex-wrap" id="user"></div>
        <div class="m-2 p-2 bg-light d-flex flex-column" style="width: 30%;">
            <div>Tambah User</div>
            <input class="form-control m-1" type="text" placeholder="nama" class="tambah-user next">
            <input class="form-control m-1" type="text" placeholder="email" class="tambah-user next">
            <input class="form-control m-1" type="text" placeholder="password" class="tambah-user next">
            <input class="btn btn-block btn-primary btn-sm p-0" type="button" placeholder="simpan" value="simpan" onclick="tambahUser()">
        </div>
        <div id="gambar"></div>
    </div>
    
    <script>
        let lognya = []
        async function report(text){
            lognya.push(text)
            return lognya;
        }

        const menu = ['lihat user', 'tambah user', 'lihat gambar']
        const host = "http://localhost:8000/api"
        const Io = io('http://localhost:8000');
        Io.on('message',async message => {
            switch(message){
                case "user":Io
                   semuaUser()
                break;
            }
        })
        Io.emit('message', 'user');

        async function semuaUser(){
            const usr = await axios.get(host+'/user-findall');
            const act = await axios.get(host+'/get-useractive');
            const prt = await axios.get(host+'/property-get');
            const user_id = act.data.data.user_id;
            
            const data = usr.data.data;
            let usrDiv = `
            <table class="table table-bordered table-sm">
                <tr class="bg-dark text-white">
                    <th>id</th>
                    <th>nama</th>
                    <th>group</th>
                    <th>gambar</th>
                    <th>property</th>
                </tr>
               
            `;
            for(let user of data){
                usrDiv += ` <tr>
                    <td >${user.id}</td>
                    <td >
                        <div>
                            <div class="p-2">${user.name}</div>
                            <div onclick="login('${user.id}')" class=" btn btn-block btn-primary text-light btn-sm p-0" id="ligin_${user.id}">login</div>
                            <div class="btn btn-sm btn-block btn-danger p-0" onclick="hapusUser(${user.id})">hapus</div>
                        </div>
                    </td>
                    <td >
                        <div style="height:200px;width:300px;overflow:scroll">
                            <small id="group_${user.id}" class="bg-dark">group</small>
                        </div>
                        <div class="p-2 bg-white border ">
                            <div class="">
                                <div id="total_${user.id}" class=""></div>
                                <div onclick="updateListGroup('${user.id}')" class=" mb-2 btn btn-info btn-sm p-0 btn-block">update list group</div>
                            </div>
                            <div class="pt-2 border-top">
                                <div>Tambah Group</div>
                                <input id="key_${user.id}" placeholder="kata kunci" class="btn-block">
                                <div onclick="tambahGroup('${user.id}')" class="btn btn-sm btn-primary p-0 btn-block">tambah</div>    
                            </div>
                        </div>
                    </td>
                    <td >
                        <div>
                            <div id="user_${user.id}" class="d-flex flex-wrap" ></div>
                            <div  class="pt-2">
                                <label class="btn btn-info btn-sm btn-block p-0" onclick="tambahGambar('${user.id}')">tambah gambar</label>
                                <input type="file" id="gambar" name="gambar" class="d-none" accept="image/*">
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="">
                            <input id="harga_${user.id}" placeholder="harga" class="form-control">
                            <textarea id="keterangan_${user.id}" placeholder="keterangan" class="form-control mt-2"></textarea>
                            <div class="d-flex flex-row-reverse"><input onclick="updateProperty('${user.id}')" type="button" class="btn btn-sm btn-block btn-info mt-2 p-0" value="save"></div>
                            <div onclick="posting('${user.id}')" class="btn btn-sm btn-primary btn-block mt-2 p-0">posting</div>
                        </div>
                    </td>
                    `
            }
            usrDiv += `</tr></table>`
            $('#user').html(usrDiv);
            let tampung = [];
            let conGroup = []
            for(let user of data){
                tampung[user.id] = [];
                let getGambar = await axios.get(host+'/gambar-where/'+user.id);
                let grp = await axios.get(host+'/group/'+user.id);
                for(let a of getGambar.data.data){
                    if(user.id == a.user_id){
                        tampung[user.id].push(`
                        <div style="width:70px;position: relative;" class="border" >
                            <div class="d-flex flex-row-reverse">
                                <div class="btn btn-outline-danger" style="position: absolute;float: right;" onclick="hapusGambar('${a.id}')">x</div>
                            </div>
                            <img src="${host}/gambar/${user.id}/${a.name}" style="width:100%">
                        </div>
                        `)
                    }
                }

                // harga dan keterangan
                for(let b of prt.data.data){
                    if(user.id == b.user_id){
                        $(`#harga_${user.id}`).val(b.harga)
                        $(`#keterangan_${user.id}`).val(b.keterangan)
                    }
                }

                
                conGroup[user.id] = []
                for(let g of grp.data.data){
                    if(user.id == g.user_id){
                        conGroup[user.id].push(`
                            <div class="p-2 border-bottom"><a target="_" href="${g.href}">${g.name}</a></div>
                        `)
                    }
                }

                $(`#group_${user.id}`).html(conGroup[user.id].join(' '));
                $(`#total_${user.id}`).html(`Total ${conGroup[user.id].length} group`);
                $(`#user_${user.id}`).html(tampung[user.id].join(' '))
            }
            
        }

        async function posting(id){
            alert(id)
        }

        async function tambahGroup(id){
            let kunci = $(`#key_${id}`).val()
            if(kunci == ""){
                alert("kata kunci gk boleh kosong")
                return;
            }
            let tam = await axios.get(host+'/group-add/'+id+'/'+kunci);
            
            
        }

        async function updateListGroup(e){
            
            await axios.get(host+'/group-update/'+e);
        }

        async function login(id){
            await axios.get(host+'/facebook-login/'+id)
        }

        async function updateProperty(id){
            const paket = {
                user_id: id,
                harga: $(`#harga_${id}`).val(),
                keterangan: $(`#keterangan_${id}`).val()
            }

            if(!Object.values(paket).every( x => x != "")){
                alert('jangan ada yang kosong');
                return;
            }

            let data = await axios.post(host+'/property-create', paket);
            alert("property berhasil diupdate")
        }

        async function hapusGambar(id){
            try {
                let hapus = await axios.post(host+'/gambar-delete', {id: id});
                
                Io.emit('message', 'user')
            } catch (error) {
                console.log(error)
            }
        }

        async function hapusUser(e){
            let data = await axios.post(host+'/user-delete',{id: e});
            
            if(data.data.status){
                Io.emit('message', 'user')
            }else{
                alert(data.data.message)
            }
        }

        async function userActiv(e, f){
  
            const paket = {
                id: 1,
                user_id: e,
                name: f
            }
            let data = await axios.post(host+'/user-active', paket);
            if(data.data.status){
                Io.emit('message', 'user');
            }else{
                alert(data.data.message)
            }
        }

        async function tambahUser(){
            let paket = {
                name: $('.tambah-user')[0].value,
                email: $('.tambah-user')[1].value,
                password: $('.tambah-user')[2].value
            }
            const data = await axios.post(host+'/user-add', paket);
            if(data.data.status){
                Io.emit('message', 'user')
                $('.tambah-user').val("")
            }else{
                alert(data.data.message)
            }
        }

        async function tambahGambar(e){
            $('#gambar').click()
            $('#gambar').change(async() => {
                const gam = $('#gambar')[0].files[0]
                const frm = new FormData()
                frm.append('gambar',gam, Math.random().toString(26).substring(7)+".png")
                const kirim = await axios.post(host+'/gambar-add',frm,{headers: {user_id: e}});
                
                Io.emit('message', 'user')
            })
        }

        $('INPUT').keydown( e => e.which === 13?$(e.target).next().focus():"");
    </script>
</body>
</html>

```

### router/router_facebook.js

```js
const { ControllerGroup } = require('../controllers/controller_facebook');
const { router } = require('../server');
const handler = require('express-async-handler');
const { ControllerFacebook } = require('./../controllers/controller_facebook')

router.get('/group/:user_id', handler( ControllerFacebook.getGroupByUser ));
router.get('/facebook-login/:id', handler( ControllerFacebook.login ))
router.get('/group-update/:id', handler( ControllerFacebook.updateGroup ))
router.get('/group-add/:id/:search', handler( ControllerFacebook.tambahGroup ))
```


### router/router_gambar.js

```js
const { ControllerGambar } = require('./../controllers/controller_gambar');
const { router } = require('./../server');
const handler = require('express-async-handler');
const upload = require('multer')({});

router.post('/gambar-add',upload.single('gambar'), handler( ControllerGambar.create ));
router.get('/gambar-findall', handler( ControllerGambar.findAll ));
router.get('/gambar/:user_id/:name', handler( ControllerGambar.lihatGambar ))
router.post('/gambar-delete', handler( ControllerGambar.delete ))
router.post('/gambar-updat', handler( ControllerGambar.update ))
router.get('/gambar-where/:id', handler( ControllerGambar.findWhere ))

```

### routers/router_property.js

```js
const { ControllerProperty } = require('./../controllers/controller_property')
const handler = require('express-async-handler');
const { router } = require('./../server')

router.post('/property-create', handler( ControllerProperty.addOrUpdate ))
router.get('/property-get', handler( ControllerProperty.getProperty ))

```

### routers/router_ctivity.js

```js
const { Setting } = require('../setting')
const { ControllerUserActiv } = require('./../controllers/controller_activ_user');
const { router } = require('./../server');
const handler = require('express-async-handler');

router.post('/user-active', handler( ControllerUserActiv.addOrUpdate ))
router.get('/get-useractive', handler( ControllerUserActiv.getUserActive ))

```

### routers/router_user.js

```js
const router = require('../server').router;
const { ControllerUser } = require('../controllers/controller_user');
const handler = require('express-async-handler');

router.post('/user-add', handler( ControllerUser.add  ))
router.get('/user-findall', handler( ControllerUser.findAll ))
router.post('/user-update', handler( ControllerUser.update ))
router.post('/user-delete', handler( ControllerUser.delete ))

```


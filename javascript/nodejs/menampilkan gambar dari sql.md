# menampilkan gambar dari sql

```js
const { ModelGambar } = require('../models/model_gambar')
const fs = require('fs');

class ControllerGambar {
    static async insert(req, res){
        const paket = {
            name: req.file.originalname,
            data: req.file.buffer,
            user_id: req.headers.user_id
        }
        var result;

        try {
            const data = await ModelGambar.create(paket);
            result = {
                status: true,
                data: data
            }
        } catch (error) {
            console.log(error)
            result = {
                status: false,
                message: error.message
            }
        }
        res.send(result);
    }

    static async select(req, res){
        var result;
        try {
            const data = await ModelGambar.findAll({
                attributes: ['id', 'name', 'user_id', 'href']
            })
            result = {
                status: true,
                data: data
            }
        } catch (error) {
            result = {
                status: false,
                message: error
            }
        }
        //console.log(req.file)
        res.send(result)
    }

    static async gambar(req, res){
        const data = await ModelGambar.findAll({
            where: {
                id: req.params.id,
                name: req.params.name
            }
        })
        if(data.length == 0){
            const image = fs.readFileSync("/Users/probus/Documents/projects/nodejs/projects/fb_v6/assets/images/no_image.png")
            res.writeHead(200,{
                'Content-Type': 'image/png',
                'Content-Length': image.length
            })
            res.end(image)
            return;
        }

        res.writeHead(200,{
            'Content-Type': 'image/png',
            'Content-Length': data[0].data.length
        })
        res.end(data[0].data)
    }

    static async gambarKu(req, res){
        var result;
        try {
            const data = await ModelGambar.findAll({
                attributes: ['name', 'id'],
                where: {
                    user_id: req.params.user_id
                }
            })
            result = {
                status:true,
                data: data
            }
        } catch (error) {
            result = {
                status: false,
                message: error
            }
            throw error;
        }
        res.send(result)
    }
}

module.exports = { ControllerGambar }
```
form data 

```js
buffer: {type: "Buffer", data: Array(112762)}
encoding: "7bit"
fieldname: "gambar"
mimetype: "image/png"
originalname: "gambarnya.png"
size: 112762
```

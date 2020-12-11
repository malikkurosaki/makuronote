# upload file and safe to sqlite

### index.js
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
    
    <h1>Halo Apa Kabar</h1>
    <input type="file" name="gambar" id="gambar">
    <img src="http://localhost:8000/api/gambar/1/satu.png" alt="">

    <script>

        $('#gambar').change(async () => {
            const gam = $('#gambar')[0].files[0];
            
            // const ini = await new Promise((resolve, reject) => {
            //     let fr = new FileReader();
            //     fr.onload = x => resolve(fr.result);
            //     fr.readAsDataURL(gam)
            // })

            // //const itu = await fetch(ini);
            // const paket = {
            //     name: gam.name.trim(),
            //     user_id: "c71887bc-30b0-4169-8ff8-1ee3ea34c824",
            //     data: ini
            // }
            const form = new FormData();
            form.append('gambar', gam, gam.name.trim())
            const kirim = await axios.post('/api/gambar-add',form,{headers: {"user_id": "c71887bc-30b0-4169-8ff8-1ee3ea34c824"}});
            console.log(kirim.data)

        })
    </script>
</body>
</html>

```

### controller_image.js
```js
const { ModelGambar } = require('./../model/model_gambar')
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
                message: error
            }
        }
        res.send(result);
    }

    static async select(req, res){
        var result;
        try {
            const data = await ModelGambar.findAll({
                attributes: ['id', 'name', 'user_id']
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

### router_image.js
```js
const { router } = require('./../server')
const { ControllerGambar } = require('./../controller/controller_gambar')
const handler = require('express-async-handler')
const upload = require('multer')({});


router.post('/gambar-add',upload.single('gambar'), handler( ControllerGambar.insert ))
router.get('/gambar-get', handler( ControllerGambar.select ))
router.get('/gambar/:id/:name', handler( ControllerGambar.gambar))
router.get('/gambarku/:user_id', handler( ControllerGambar.gambarKu ))

```

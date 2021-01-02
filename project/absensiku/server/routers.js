const { router, webRouter } = require('./server');
const { Akuns } = require('./models/akun')
const handler = require('express-async-handler');
const path = require('path');
const { Gambars } = require('./models/gambar');
const upload = require('multer')({}).single("file");


// let paket = {};
// const menu = ["buat karyawan", "lihat"];


// paket.menu = menu;


//webRouter.get('/', (req, res) => res.render('index', paket));
//webRouter.get('/karyawan', (req, res) => res.render('index', paket));


// akun router

router.get('/lihat-semua', handler( Akuns.lihatSemuaRouter ) )
router.post('/simpan-karyawan', handler(Akuns.simpanRouter) )
router.get('/lihat-karyawan', handler( Akuns.lihatSemuaRouter ))


router.post('/simpan-gambar', upload, handler(Gambars.simpanGambarRouter) );
router.get('/lihat-gambar/:user_id/:name', handler( Gambars.lihatGambarRouter ));
router.get('/lihat-semua-gambar', handler(Gambars.lihatSemuaGambarRouter ))


module.exports = { router }
# slim php complete

_composer_

```json
{
    "require": {
        "slim/slim": "3.*",
        "slim/twig-view": "^2.0",
        "simplon/mysql": "^2.2"
    },
    "autoload": {
        "classmap": [
            "controller"
        ],
        "psr-4": {
            "Malik\\":"controller"
        }
    }
}
```

_route_

```php
<?php
require __DIR__ .'/../vendor/autoload.php';
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Container;
use \Slim\App;
use \Slim\Views\Twig;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;


$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];

$con = new Container($configuration);
$app = new App($con);
$con = $app->getContainer();

// twig view
$con['twig'] = function()use ($con){
    $view = new Twig(__DIR__.'/../views');
    $router = $con->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
    return $view;
};

$con['navigasi'] = [
    [
        'nama'=>"dashboard",
        "alamat"=>"/admin/dashboard"
    ],

    [
        'nama'=>'penjualan',
        'alamat'=>'/admin/penjualan'
    ],
    [
        'nama'=>'tambah produk',
        'alamat'=>'/admin/tambah-produk'
    ]
];



// database
$con['local'] = $_SERVER['SERVER_PORT'] == '8080';
$con['sql'] = new \Malik\DatabaseController($con);
$con['home'] = new \Malik\HomeController($con);
$con['gudang'] = new \Malik\GudangController($con);
$con['penjualan'] = new \Malik\PenjualanController($con);
$con['pembelian'] = new \Malik\PembelianController($con);
$con['supplier'] = new \Malik\SupplierController($con);
$con['unit'] = new \Malik\UnitController($con);
$con['admin'] = new \Malik\AdminController($con);

// route
$app->get('/','home:home');
$app->get('/install','sql:install');

// produk
$app->post('/api/v1/tambah/produk','gudang:tambahProduk');
$app->get('/api/v1/lihat/semua-produk','gudang:lihatSemuaProduk');
$app->post('/api/v1/hapus/produk','gudang:hapusProduk');
$app->get('/api/v1/cari/produk/{nama}','gudang:cariProduk');
$app->get('/api/v1/cari/produk/by/{unit}','gudang:getProdukByUnit');

// penjualan
$app->post('/api/v1/tambah/penjualan','penjualan:penjualan');
$app->get('/api/v1/lihat/semua-penjualan','penjualan:lihatSemuaPenjualan');
$app->post('/api/v1/hapus/penjualan','penjualan:hapusPenjualan');
$app->get('/api/v1/lihat/penjualan/by/{tanggal}','penjualan:lihatPenjualanByTanggal');

// pembelian
$app->post('/api/v1/tambah/pembelian','pembelian:pembelian');
$app->get('/api/v1/lihat/semua-pembelian','pembelian:lihatSemuaPembelian');
$app->post('/api/v1/hapus/pembelian','pembelian:hapusPembelian');

// supplier
$app->post('/api/v1/tambah/supplier','supplier:tambahSupplier');
$app->get('/api/v1/lihat/semua-supplier','supplier:lihatSemuaSupplier');
$app->post('/api/v1/hapus/supplier','supplier:hapusSupplier');

// unit
$app->post('/api/v1/tambah/unit','unit:tambahUnit');
$app->get('/api/v1/lihat/semua-unit','unit:lihatSemuaUnit');
$app->post('/api/v1/hapus/unit','unit:hapusUnit');

// admin
$app->get('/admin[/{param}]','admin:admin');
$app->post('/api/v1/tambah/navigasi','admin:tambahNavigasi');
$app->get('/api/v1/lihat/semua-navigasi','admin:lihatSemuaNavigasi');
$app->post('/api/v1/hapus/navigasi','admin:hapusNavigasi');


$app->run();






```

_htaccess_

```htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
AllowOverride All
```

_database_

```php
<?php
namespace Malik;
use Psr\Container\ContainerInterface;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

class DatabaseController{
    protected $con;

    public function __construct(ContainerInterface $con){
        $this->con = $con;
    }

    public function connect(){
        if($this->con->local){
            $pdo = new PDOConnector(
                'localhost',
                'root',
                'makuro123',
                'cinta_beauty'
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }else{
            $pdo = new PDOConnector(
                'localhost',
                'root',
                'makuro123',
                'cinta_beauty'
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }
    }

    public function install($req,$res){
$sql = <<<EOD
drop table if exists penjualan;
create table penjualan
(
    id int auto_increment primary key,
    tanggal timestamp,
    nama_supplier varchar(199),
    id_supprier varchar(199),
    nama_produk varchar(199),
    id_produk varchar(199),
    harga int(199),
    qty int(199),
    total int(199),
    unit varchar(199)
);
drop table if exists pembelian;
create table pembelian
(
    id int auto_increment primary key,
    tanggal timestamp,
    nama_supplier varchar(199),
    id_supprier varchar(199),
    qty int(199),
    nama_produk varchar(199),
    id_produk varchar(199),
    harga int(199),
    operational int(199),
    total int(199),
    unit varchar(199)
);
drop table if exists supplier;
create table supplier
(
    id int auto_increment primary key,
    id_supprier varchar(199),
    nama_supplier varchar(199),
    alamat varchar(199),
    contact varchar(199),
    tanggal timestamp,
    kategori varchar(199)
);
drop table if exists produk;
create table produk
(
    id int auto_increment primary key,
    id_produk varchar(199),
    nama_produk varchar(199),
    nama_supplier varchar(199),
    id_supplier varchar(199),
    harga_pokok int(199),
    harga_jual int(199),
    jenis varchar(199),
    kategori varchar(199),
    tanggal timestamp,
    stok int(199),
    unit varchar(199),
    ukuran varchar(199)
);
drop table if exists unit;
create table unit
(
    id int auto_increment primary key,
    nama_unit varchar(199),
    tanggal timestamp
);
drop table if exists navigasi;
create table navigasi
(
    id int auto_increment primary key,
    nama varchar(199),
    alamat varchar(199),
    bawaan varchar(199)
)
EOD;

$sql2 = <<<EOD
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'cinta_beauty';
EOD;
        $query = $this->connect()->executeSql($sql);
        return $res->withJson(is_null($query)?['res'=>false]:['res'=>true,
        'data'=>$this->con->sql->connect()->fetchRowMany($sql2)
        ]);
    }

   

}
```

_header_

```html
<link rel="stylesheet" href="https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css" integrity="sha384-wXznGJNEXNG1NFsbm0ugrLFMQPWswR3lds2VeinahP8N0zJw9VWSopbjv2x7WCvX" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js" integrity="sha384-fA23ZRQ3G/J53mElWqVJEGJzU0sTs+SvzG8fXVWP+kJQ1lwFAOkcUOysnlKJC33U" crossorigin="anonymous"></script>
<script src="https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js" integrity="sha384-CauSuKpEqAFajSpkdjv3z9t8E7RlpJ1UP0lKM/+NdtSarroVKu069AlsRPKkFBz9" crossorigin="anonymous"></script>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script>$(document).ready(function() { $('body').bootstrapMaterialDesign(); });</script>
<link href="https://unpkg.com/tabulator-tables@4.6.3/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@4.6.3/dist/js/tabulator.min.js"></script>
<style>
    body,html{
        height: 100%;
    }
</style>
```

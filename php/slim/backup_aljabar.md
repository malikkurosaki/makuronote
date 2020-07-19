# backup al-jabar

### composer.json

```json
{
    "require": {
        "slim/slim": "3.*",
        "pug/slim": "^1.2",
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

### index.php

```php
<?php
require __DIR__.'/public/index.php';
```

### rest_api.http

```http
### INSTALL
GET http://127.0.0.1:8080/install


### DEVELOPER
GET http://127.0.0.1:8080/developer HTTP/1.1


### TAMBAH ADMIN
POST  http://127.0.0.1:8080/api/v1/tambah/data HTTP/1.1
Content-Type: application/json

{
    "table":"admin",
    "data":{
        "nama":"malik",
        "email":"email",
        "password":"password"
    }
}

### LOGIN ADMIN
POST http://127.0.0.1:5000/api/v1/login/admin HTTP/1.1
Content-Type: application/json

{
    "email":"email",
    "password":"password"
}

### LOGOUT ADMIN
GET http://127.0.0.1:5000/api/v1/logout/admin HTTP/1.1

### TAMBAH DATA PRODUK
POST https://aljabar2.000webhostapp.com/api/v1/tambah/data HTTP/1.1
Content-Type: application/json

{
    "table":"produk",
    "data":{
        "nama":"layangan burung",
        "kode":"kd_000111",
        "jenis":"barang",
        "kategori":"depan",
        "ukuran":"1x1 m"
    }
}

### TAMBAH DATA PELANGGAN
POST http://127.0.0.1:8080/api/v1/tambah/data HTTP/1.1
Content-Type: application/json


{
    "table":"pelanggan",
    "data":{
        "nama":"malik",
        "alamat":"bali",
        "telpon":"081338929722"
    }
}


### TAMBAH PESANAN
POST http://127.0.0.1:8080/api/v1/tambah/data HTTP/1.1
Content-Type: application/json

{
    "table":"pesanan",
    "data":{
        "id_pesanan":"apa",
        "nama_produk":"apa",
        "ukuran":"apa",
        "jenis":"apa",
        "warna":"apa",
        "nama_pelanggan":"apa",
        "id_pelanggan":"apa",
        "pemesan":"apa",
        "id_pemesan":"apa",
        "status":"apa",
        "jatuh_tempo":"2020-09-08"
    }
}




### LIHAT SEMUA DATA PRODUK
GET http://127.0.0.1:8080/api/v1/lihat/semua/produk HTTP/1.1


### LIHAT SEMUA DATA PRODUK
GET http://127.0.0.1:5000/api/v1/lihat/semua/pelanggan HTTP/1.1


### CARI PELANGGAN
GET http://127.0.0.1:8080/api/v1/cari/pelanggan/malik HTTP/1.1

### CARI PELANGGAN DENGAN ID
GET http://127.0.0.1:8080/api/v1/cari/pelanggan/dengan/1 HTTP/1.1

### LIHAT PESANAN
GET http://127.0.0.1:8080/api/v1/lihat/pesanan/1 HTTP/1.1
```

### public/indexs.php

```php
<?php
session_start();
require __DIR__ .'/../vendor/autoload.php';
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Container;
use \Slim\App;
use \Slim\Views\Twig;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;
use \Slim\Pug\PugRenderer;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];

$con['notFoundHandler'] = function ($con) {
    return function ($req, $res) use ($con) {
        return $con->twig->render($res->withStatus(404),'404.html');
    };
};


$con = new Container($configuration);
$app = new App($con);
$con = $app->getContainer();

$con['view'] = new PugRenderer(__DIR__.'/../views');
$con['local'] = $_SERVER['SERVER_PORT'] == '8080';
$con['dbName'] = $_SERVER['SERVER_PORT'] == '8080'?'al_jabar':'id14212002_al_jabar';

// controller
$con['db'] = new \Malik\Database($con);
$con['home'] = new \Malik\Home($con);
$con['admin'] = new \Malik\Admin($con);
$con['auth']  = new \Malik\Auth($con);
$con['developer'] = new \Malik\Developer($con);

// database
$app->get('/install','db:install');


$app->get('/','home:home');

//admin
$app->get('/admin','admin:admin');
$app->post('/api/v1/tambah/data','admin:tambahData');
$app->get('/api/v1/lihat/semua/{table}','admin:lihatSemuaData');
$app->get('/api/v1/cari/pelanggan/{nama}','admin:cariPelanggan');
$app->get('/api/v1/cari/pelanggan/dengan/{id}','admin:cariPelangganDenganId');
$app->get('/api/v1/lihat/pesanan/{id}','admin:lihatPesanan');

// developer
$app->get('/developer','developer:developer');

//auth
$app->post('/api/v1/login/admin','auth:adminLogin');
$app->get('/api/v1/logout/admin','auth:adminLogOut');



$app->run();

```

### public/.htaccess

```htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
AllowOverride All
```

### .htaccess

```htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

### controller/admin.php

```php
<?php
namespace Malik;

class Admin{
    protected $con;

    public function __construct(\Psr\Container\Containerinterface $con){
        $this->con = $con;
    }

    public function admin($req,$res){
        $paket['user'] = isset($_SESSION['user'])?true:false;
        return $this->con->view->render($res,'admin.pug',$paket);
    }

    public function tambahData($req,$res){
        $paket = \json_decode($req->getBody(),true);
        $query = $this->con->db->connect()->insert($paket['table'],$paket['data']);
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'total'=>$this->con->db->connect()->fetchColumn('select count(*) as total from '.$paket['table'])]
        );
    }

    public function lihatSemuaData($req,$res,$args){
        $dbName = $this->con->dbName;
        $table = isset($args['table'])?$args['table']:null;
        $ada = is_null($table)?null:$this->con->db->connect()->fetchRowMany("select table_name from information_schema.tables where table_schema = '$dbName'");
        $query = is_null($ada)?null:$this->con->db->connect()->fetchRowMany("select * from $table");
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
    }


    public function cariPelanggan($req,$res,$args){
        $nama = $args['nama'];
        $query = $this->con->db->connect()->fetchRowMany("select * from pelanggan where nama like '%$nama%'");
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
    }

    public function cariPelangganDenganId($req,$res,$args){
        $id['id'] = $args['id'];
        $query = $this->con->db->connect()->fetchRow('select * from pelanggan where id = :id',$id);
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
    }

    public function lihatPesanan($req,$res,$args){
        $id['id'] = $args['id'];
        $query = $this->con->db->connect()->fetchRowMany('select * from pesanan where id_pelanggan = :id',$id);
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
    }

}
```

### controller/auth.php

```php
<?php
namespace Malik;

class Auth{
    protected $con;

    public function __construct(\Psr\Container\Containerinterface $con){$this->con = $con;}

    public function adminLogin($req,$res){
        $data  = \json_decode($req->getBody(),true);
        $query = $this->con->db->connect()->fetchColumn('select nama from admin where email = :email and password = :password',$data);
        $apa = is_null($query)?null:$_SESSION['user'] = $query;
        return $res->withJson(
            is_null($apa)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
    }

    public function adminLogOut($req,$res){
        \session_unset();
        return $res->withJson(
            isset($_SESSION['user'])?
            ['res'=>false]:['res'=>true]
        );
    }


    
    public function userLogOut($req,$res){
        \session_unset();
        return $res->withredireq('/home');
    }



    
    
}
```

### controller/database.php

```php
<?php
namespace Malik;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

class Database{
    protected $con;

    public function __construct(\Psr\Container\Containerinterface $con){$this->con=$con;}
    public function connect(){
        if($this->con->local){
            $pdo = new PDOConnector(
                'localhost',
                'root',
                'makuro123',
                $this->con->dbName
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }else{
            $pdo = new PDOConnector(
                'localhost',
                'id14212002_root',
                'Makuro_12345',
                $this->con->dbName
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }
    }

    public function install($req,$res){
$sql = <<<EOD
drop table if exists admin;
create table admin
(
id int unsigned auto_increment primary key,
nama varchar(199),
email varchar(199),
password varchar(199),
kelas varchar(199),
tanggal timestamp default current_timestamp on update current_timestamp
);
drop table if exists pengguna;
create table pengguna
(
id int unsigned auto_increment primary key,
nama varchar(199),
email varchar(199),
password varchar(199),
tanggal timestamp default current_timestamp on update current_timestamp
);
drop table if exists pelanggan;
create table pelanggan
(
id int unsigned auto_increment primary key,
nama varchar(199),
alamat varchar(199),
telpon varchar(199),
tanggal timestamp default current_timestamp on update current_timestamp
);
drop table if exists produk;
create table produk
(
id int unsigned auto_increment primary key,
nama varchar(199),
kode varchar(199),
jenis varchar(199),
kategori varchar(199),
ukuran varchar(199),
tanggal timestamp default current_timestamp on update current_timestamp
);
drop table if exists pesanan;
create table pesanan
(
id int unsigned auto_increment primary key,
id_pesanan varchar(199),
nama_produk varchar(199),
ukuran varchar(199),
jenis varchar(199),
warna varchar(199),
nama_pelanggan varchar(199),
id_pelanggan varchar(199),
pemesan varchar(199),
id_pemesan varchar(199),
status varchar(199),
jatuh_tempo date,
tanggal timestamp default current_timestamp on update current_timestamp
);
EOD;
        $query = $this->connect()->executeSql(str_replace("\n","",$sql));
        $dbName['dbName'] = $this->con->dbName;
        $query2 = $this->connect()->fetchRowMany("select table_name as nama from information_schema.tables where table_schema = :dbName",$dbName);
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query2]
        );
    }

    // public function tambahData($req,$res){
    //     $data = json_decode($req->getBody(),true);
    //     $query = $this->connect()->insert($data['table'],$data['konten']);
    //     return $res->withJson(
    //         is_null($query)?
    //         ['res'=>false]:['res'=>true]
    //     );
    // }
    
    
}




```

### controller/home.php

```php
<?php
namespace Malik;
use Psr\Container\ContainerInterface;

class Home{
    protected $con;

    public function __construct(\Psr\Container\Containerinterface $con){
        $this->con = $con;
    }

    public function home($req,$res){
        $nama['nama'] = 'malik';
        $user = isset($_SESSION['user']);
        return $this->con->view->render($res,$user?'index.pug':'login-user.pug',$nama);
    }
}
```

# complete server

public/index.php

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


$con['local'] = $_SERVER['SERVER_PORT'] == '8080';
$con['db'] = new \Malik\Database($con);
$con['Home'] = new \Malik\Home($con);
$con['Customer'] = new \Malik\Customer($con);

// controller
$con['Controller'] = new \Malik\Controller($con);


$app->get('/', 'Home:home');

// controller api rest
$app->get('/lihat/{table}','Controller:lihat');
$app->post('/simpan','Controller:simpan');
$app->post('/update','Controller:update');
$app->post('/hapus','Controller:hapus');
$app->post('/table','Controller:table');
$app->post('/kolom','Controller:kolom');
$app->get('/cari/{table}/{id}','Controller:cari');

// buat table
$app->post('/buat-table','Controller:buatTable');
$app->post('/hapus-table','Controller:hapusTable');
$app->post('/tambah-kolom','Controller:tambahKolom');
$app->post('/hapus-kolom','Controller:hapusKolom');

$app->run();


```

public/.htaccess

```htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
AllowOverride All
```

controller/controller.php

```php
<?php
namespace Malik;

class Controller{
    protected $con;
    public function __construct($con){
        $this->con = $con;
    }

    public function lihat($req,$res,$args){
        $table = $args['table'];
        $lihat = $this->con->db->connect()->fetchRowMany("select * from $table");
        return $res->withJson(
            is_null($lihat)?["res"=>false]:["res"=>true,"data"=>$lihat]
        );
    }
    
    public function simpan($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $data = $paket['data'];
        $simpan = $this->con->db->connect()->insert($table,$data);
        return $res->withJson(
            is_null($simpan)?["res"=>false]:["res"=>true]
        );
    }

    public function update($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $id = $paket['id'];
        $data = $paket['data'];
        $update = $this->con->db->connect()->update($table,["id"=>$paket['id']],$data);
        return $res->withJson(
            is_null($update)?['res'=>false]:['res'=>true]
        );
    }

    public function hapus($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $id = $paket['id'];
        $hapus = $this->con->db->connect()->delete($table,['id'=>$id]);
        return $res->withJson(
            is_null($hapus)?['res'=>false]:['res'=>true]
        );
    }

    public function table($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $dbName = $paket['db'];
        $query = "select table_name as nama from information_schema.tables where table_schema = '$dbName' ";
        return $res->withJson($this->con->db->connect()->fetchRowmany($query));
    }

    public function kolom($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $db = $paket['db'];
        $table = $paket['table'];
        $query = "select column_name as nama from information_schema.columns where table_schema = '$db' and table_name = '$table'";
        return $res->withJson($this->con->db->connect()->fetchRowMany($query));
    }

    public function cari($req,$res,$args){
        $table = $args['table'];
        $id = $args['id'];
        $query = "select * from $table where id = '$id'";
        return $res->withJson($this->con->db->connect()->fetchRow($query));
    }


    /* BUAT TABLE */
    public function buatTable($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $hasil = false;

        $sql = "create table $table";
        $sql .= "(";
        $sql .= "id int auto_increment, ";
        foreach($paket['data'] as $a => $b ){
            $sql  .= "$a varchar(199),";
        }
        $sql .= "tanggal timestamp not null default current_timestamp,";
        $sql .= "primary key (id)";
        $sql .= ")";

        try {
            $buat = $this->con->db->connect()->executeSql($sql);
            $hasil = true;
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $res->withJson($hasil);
    }

    /* HAPUS TABLE */
    public function hapusTable($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $sql = "drop table $table";
        $hasil = false;
        try {
            $hapus = $this->con->db->connect()->executeSql($sql);
            $hasil = true;
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $res->withJson($hasil);
    }

    /* TAMBAH KOLOM */
    public function tambahKolom($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $data = $paket['data'];

        $sql = "alter table $table ";
        foreach($data as $a => $b){
            $sql .= " add column $a varchar(199),";
        }
        $sql .= ",";
        $hasil = str_replace(',,','',$sql);
        $maka = false;

        try {
            $tambah = $this->con->db->connect()->executeSql($hasil);
            $maka = true;
        } catch (\Throwable $th) {
            //throw $th;
        }
        
        return $res->withJson($maka);
    }

    /* HAPUS KOLOM */
    public function hapusKolom($req,$res,$args){
        $paket = json_decode($req->getBody(),true);
        $table = $paket['table'];
        $kolom = $paket['kolom'];

        $sql = "alter table $table";
        foreach($kolom as $a => $b){
            $sql .= " drop column $a,";
        }
        $sql .= ",";
        $sql = str_replace(",,","",$sql);
        $hasil = false;
        try {
            $kurangi = $this->con->db->connect()->executeSql($sql);
            $hasil = true;
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $res->withJson($hasil);
    }
}
```

controller/database.php

```php

<?php 
namespace Malik;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

class Database{
    protected $con;
    
    public function __construct($con) { 
        $this->con = $con;
    }

    public function connect(){
        if($this->con->local){
            $pdo = new PDOConnector(
                'localhost',
                'root',
                'Makuro_123',
                'aljabar'
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }else{
            $pdo = new PDOConnector(
                'localhost',
                'root',
                'Makuro_123',
                'aljabar'
            );
            $pdoConn = $pdo->connect('utf8', []);
            $dbConn = new Mysql($pdoConn);
            return $dbConn;
        }
    }

}
```

controller/home.php

```php
<?php
namespace Malik;

class Home {
    protected $con;

    public function __construct($con){
        $this->con = $con;
    }

    public function home($req,$res){
        return $res->withJson('apa kabar');
    }
}
```

composer.json

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

x.rest

```rest
### lihat

GET http://localhost:8080/lihat/customers HTTP/1.1

### simpan
POST http://localhost:8080/simpan HTTP/1.1
Content-Type: application/json

{
    "table": "customers",
    "data": {
        "customer_name": "malik",
        "gender": "male",
        "country": "indonesia",
        "phone": "081",
        "address": "denpasar",
        "email": "gmail",
        "activ": 1
    }
}

### update 

POST http://localhost:8080/update HTTP/1.1
Content-Type: application/json

{
    "table": "customers",
    "id": "1",
    "data": {
        "customer_name": "agung"
    }
}

### hapus
POST http://localhost:8080/hapus HTTP/1.1
Content-Type: application/json

{
    "table": "customers",
    "id": "1"
}

### table
POST http://localhost:8080/table HTTP/1.1
Content-Type: application/json

{
    "db": "aljabar"
}

### lihat kolom
POST http://localhost:8080/kolom HTTP/1.1
Content-Type: application/json

{
    "db": "aljabar",
    "table": "siapa"
}

### cari 
GET http://localhost:8080/cari/customers/2 HTTP/1.1

### buat table
POST http://localhost:8080/buat-table HTTP/1.1
Content-Type: application/json

{
    "table": "siapa",
    "data": {
        "nama": "",
        "alamat": ""
    }
}

### hapus table
POST http://localhost:8080/hapus-table HTTP/1.1
Content-Type: application/json

{
    "table": "siapa"
}

### tambah kolom

POST http://localhost:8080/tambah-kolom HTTP/1.1
Content-Type: application/json

{
    "table": "siapa",
    "data": {
        "email": "",
        "pass": ""
    }
}

### hapus kolom
POST http://localhost:8080/hapus-kolom HTTP/1.1
Content-Type: application/json

{
    "table": "siapa",
    "kolom": {
        "email": "",
        "pass": ""
    }
}
```

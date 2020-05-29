# slim php mysql 

```js
{
    "require": {
        "slim/slim": "3.*",
        "slim/php-view": "^2.2",
        "slim/twig-view": "^2.0",
        "simplon/mysql": "^2.2"
    }
}

```

```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Views\PhpRenderer;
use \Slim\Container;
use \Slim\App;
use \Slim\Views\Twig;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

require __DIR__ .'/../vendor/autoload.php';
$app = new App();
$con = $app->getContainer();


$con['db'] = function(){
    $db = mysqli_connect('localhost','root','makuro123','panduan_flutter');
    if(!$db){
        die('conneksi database terputus'.mysqli_connect_error());
    }
    return $db;
};

$con['sql'] = function(){
    $pdo = new PDOConnector(
        'localhost', // server
        'root',      // user
        'makuro123',      // password
        'panduan_flutter'   // database
    );
    $pdoConn = $pdo->connect('utf8', []);
    $dbConn = new Mysql($pdoConn);
    return $dbConn;
};

$con['view'] = new PhpRenderer(__DIR__.'/../views');
$con['twig'] = function()use ($con){
    $view = new Twig(__DIR__.'/../views');
    $router = $con->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
    return $view;
};


$app->get('/coba',function(Request $req,Response $res) use ($con){
    $data  = $con->sql->fetchRowMany('select judul from konten');
    return $res->withJson($data);
});

$app->get('/',function(Request $req,Response $res) use ($con){
    $sql = "select * from konten";
    $query = mysqli_query($con->db,$sql);
    $hasil = [];
    while($row = mysqli_fetch_assoc($query)){
        array_push($hasil,$row);
    }
    return $con->twig->render($res,'index.html',["konten"=>$hasil]);
});



$app->get('/adm',function(Request $req,Response $res)use ($con){
    $sql = "select * from konten";
    $query = mysqli_query($con->db,$sql);
    $hasil = [];
    while($row = mysqli_fetch_assoc($query)){
        array_push($hasil,$row);
    }
    return $con->twig->render($res,'adm.html',["konten"=>$hasil]);
});

$app->post('/konten-baru',function(Request $req,Response $res)use($con){
    $paket = json_decode($req->getBody());
   
    $sql = <<<SQL
insert into konten values(
    null,
    "$paket->judul",
    "$paket->kategori",
    "$paket->isi",
    "$paket->keterangan",
    curdate(),
    "$paket->gambar"
)
SQL;
$query = mysqli_query($con->db,$sql);
if($query){
    $res->write(true);
}else{
    $res->write(mysqli_error($con->db));
}
});

$app->post('/update-konten',function(Request $req,Response $res)use($con){
    $data = json_decode($req->getBody());
    $sql = " update konten set judul = %s, kategori = %s,isi = %s,keterangan = %s,gambar = %s,tanggal = %s";
    $sql = printf($sql,"stu","dua","tiga","empat","lima","curdate()");

return $res->write($sql);
});

$app->post('/hapus-konten',function(Request $req,Response $res,$args)use($con){
    $id = json_decode($req->getBody());
    $sql = "delete from konten where id = ".$id->id;
    $query = mysqli_query($con->db,$sql);
    if($query){
        return $res->write(true);
    }else{
        return $res->write(mysqli_error($con->db));
    }
});

$app->run();
```

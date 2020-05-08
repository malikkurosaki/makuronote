# contoh slim php 

```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Views\PhpRenderer;
use \Slim\Container;
use \Slim\App;

// unset($app->getContainer()['notFoundHandler']);
// $app->getContainer()['notFoundHandler'] = function ($c) {
//     return function ($request, $response) use ($c) {
//         $response = new \Slim\Http\Response(404);
//         return $response->write("Page not found");
//     };
// };


require 'vendor/autoload.php';

if($_SERVER['SERVER_NAME'] == 'localhost'){
    require 'vendor/db.php';
}else{
    require 'vendor/db2.php';
}

$app = new App();
$container = $app->getContainer();


$container['db'] = function($container) {
    $con = mysqli_connect('localhost', 'root','makuro123','savana');
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $con;
};

$container['view'] = new PhpRenderer('./views');

// database
function db(){
    $con = mysqli_connect('localhost', 'root','makuro123','savana');
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $con;
};

// dapatkan data
function getData($sql){
    $cari = mysqli_query(db(),$sql);
    $hasil = [];
    while($row = mysqli_fetch_assoc($cari)){
        array_push($hasil,$row);
    }
    mysqli_close(db());
    return json_encode($hasil);
}

$app->get('/coba',function($request,$response,$args){

    $sql = 'select * from gudang';
    $cari = mysqli_query($this->db,$sql);
    $hasil = [];
    while($row = mysqli_fetch_assoc($cari)){
      array_push($hasil,$row);
    }
  
    echo json_encode($hasil);
    
  });

$app->get('/', function (Request $request, Response $response, array $args) {
    
});

$app->get('/baru',function(){
    $sql = 'select * from gudang';
    echo getData($sql);
});

$app->get('/lihat',function($request,$response,$args){
    $sql = 'select * from gudang';
    return $this->view->render($response,'index.html',['data'=>getData($sql)]);
});

$app->get('/buat-tabel',function($request,$response,$args){
$sql =
<<<EOD
create table if not exists t_users(
        c_id int primary key auto_increment,
        c_name varchar(255),
        c_email varchar(255),
        c_pass varchar(255),
        c_phone varchar(255)
    )
EOD;

    $db = new db();
    $con = $db->connect();
    $apa = mysqli_query($con,$sql);
    if($apa){
        echo 'berhasil';
    }else{
        echo 'gagal';
    }
});

$app->get('/users/{siapa}',function($request,$response,$args){
    echo $args['siapa'];
});

$app->post('/apa',function($request,$response,$args){
    $hasil = $request->getBody();
    $apa= json_decode($hasil);
    echo $apa->nama;
});
$app->run();
```

```javascript
{  
    "require": {
        "slim/slim": "3.*",
        "slim/php-view": "^2.2"
    }
}
```

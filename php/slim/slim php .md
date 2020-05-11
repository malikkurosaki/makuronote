# slim php

```php
<?php
require 'vendor/autoload.php';
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \Slim\App;
use Slim\Views\PhpRenderer;
use \Slim\Container;

$container = new Container();
$app = new App($container);
$container = $app->getContainer();

function view(){
    return new PhpRenderer('view');
};

function db(){
    $db = mysqli_connect('localhost','root','makuro123','savana');
    if(mysqli_connect_errno()){
        echo mysqli_connect_error();
        exit();
    }
    return $db;
};

function getData($sql){
    $query = mysqli_query(db(),$sql);
    $hasil = [];
    while ($row = mysqli_fetch_assoc($query)) {
        array_push($hasil,$row);
    }
    mysqli_close(db());
    return json_encode($hasil);
}

function lihatGambar(){
    $gam = array_diff(scandir('assets/images/upload'),array('.','..'));
    $hasil = [];
    foreach($gam as $val){
        $alamat = ['gambar'=>'/assets/images/upload/'.$val];
        array_push($hasil,$alamat);
    }
    return json_encode($hasil);
}



$app->get('/', function (Request $req,  Response $res, $args = []) {
    $sql = <<<SQL
select * from isi
SQL;
    return view()->render($res,'index.html',[
        'data'=>getData($sql),
        'gambars'=>lihatGambar()
    ]);
});

$app->post('/simpan-gambar',function($req,$res,$args){
   
    $files = $req->getUploadedFiles();
    if (empty($files['file'] || $files['file'] == null)) {
        throw new Exception('No file has been send');
    }
    $myFile = $files['file'];
    if ($myFile->getError() === UPLOAD_ERR_OK) {
        $uploadFileName = $myFile->getClientFilename();
        $myFile->moveTo('assets/images/upload/' . $uploadFileName);
        echo 'assets/images/upload/' . $uploadFileName;
    }else{
        echo false;
    }
    
});

$app->post('/tambah-konten',function($request,$response,$args){
    $data = $request->getBody();
    $jadi = json_decode($data);

$sql = 
<<<EOD
insert into isi values(
    null,
    "$jadi->judul",
    "$jadi->gambar",
    "$jadi->ket"
)
EOD;

if(mysqli_query(db(),$sql)){
    echo 'berhasil';
}else{
    echo mysqli_error(db());
}

});


$app->run();

```

# backup istem system


### route

``` php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Container;
use \Slim\App;
use \Slim\Views\Twig;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

require __DIR__ .'/../vendor/autoload.php';

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$con = new Container($configuration);

$local = $_SERVER['REMOTE_ADDR'] == "127.0.0.1";

$con['sql'] = function()use($local){
    if($local){
        $pdo = new PDOConnector(
            'localhost',
            'root',
            'makuro123',
            'db_istem'
        );
        $pdoConn = $pdo->connect('utf8', []);
        $dbConn = new Mysql($pdoConn);
        return $dbConn;
    }else{
        $pdo2 = new PDOConnector(
            'localhost',
            'id13965788_root',
            'Makuro_12345',
            'id13965788_db_istem'
            );
        $pdoConn2 = $pdo2->connect('utf8', []);
        $dbConn2 = new Mysql($pdoConn2);
        return $dbConn2;
    }
};
$con['db_name'] = $local?'db_istem':'id13965788_db_istem';


// twig
$con['twig'] = function()use ($con){
    $view = new Twig(__DIR__.'/../views');
    $router = $con->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
    return $view;
};

// page not found handler
$con['notFoundHandler'] = function($con){
    return function ($request, $response) use ($con) {
        return $con->twig->render($response,'page_not_found.html');
    };
};

$app = new App($con);
$con = $app->getContainer();

$app->get('/install',function(Request $req,Response $res){
    $sql = <<<SQL
drop table if exists anggota;
create table if not exists anggota(
id int auto_increment primary key,
nama_depan varchar(199),
nama_belakang varchar(199),
panggilan varchar(199),
email varchar(199),
password varchar(199),
alamat varchar(199),
hp varchar(199),
jabatan varchar(199),
tanggal date
);
drop table if exists stem;
create table if not exists stem(
id int primary key,
judul varchar(199),
keterangan varchar(199),
gambar varchar(199),
video varchar(199),
isi text(199),
filenya varchar(199)
);
drop table if exists edu_stem;
create table if not exists edu_stem(
id int auto_increment primary key,
jenjang varchar(199),
kelas varchar(199),
kategori varchar(199),
jenis varchar(199),
judul varchar(199),
video varchar(199),
keterangan varchar(199),
gambar varchar(199),
isi text,
filenya varchar(199),
tanggal date
);
drop table if exists tentang;
create table if not exists tentang(
id int auto_increment primary key,
judul varchar(199),
gambar varchar(199),
video varchar(199),
keterangan varchar(199),
isi text,
pengembang text
);
drop table if exists master_jenjang;
create table if not exists master_jenjang(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists master_kelas;
create table if not exists master_kelas(
id int auto_increment primary key,
nama varchar(199),
id_kelas int(199)
);
drop table if exists master_jenis;
create table if not exists master_jenis(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists master_kategori;
create table if not exists master_kategori(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists stem_video;
create table if not exists stem_video(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
);
drop table if exists tampungan_video;
create table if not exists tampungan_video(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
);
drop table if exists tampungan_gambar;
create table if not exists tampungan_gambar(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
)

SQL;
    $query = $this->sql->executeSql($sql);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
});

$app->get('/set-master',function(Request $req,Response $res)use ($con){
   $sql = <<<SQL
insert into master_jenjang values
(1,"elementary school"),
(2,"junior hight school"),
(3,"senior hight school"),
(4,"hight education");
insert into master_kelas values
(1,"I",1),
(2,"II",1),
(3,"III",1),
(4,"IV",1),
(5,"V",1),
(6,"VI",1),
(7,"VII",2),
(8,"VIII",2),
(9,"IX",2),
(10,"X",3),
(11,"XI",3),
(12,"XII",3);
insert into master_kategori values
(1,"global warning"),
(2,"pressure"),
(3,"wave");
insert into master_jenis values
(1,"lesson plan"),
(2,"e-book"),
(3,"edukits"),
(4,"argumen reality"),
(5,"virtual relity"),
(6,"assessment"),
(7,"video implementasi");  
SQL;
    $query = $this->sql->executeSql($sql);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
    
});

$app->get('/',function(Request $req,Response $res)use ($con){
    $menu = [
       "ISTEM",
       "EDUSTEM",
       "EDU-CLASS",
       "EDU-GAME",
       "ARGUMENT-REALITY",
       "VIRTUAL-REALITY",
       "ABOUT"
    ];
    $host = $_SERVER['REMOTE_ADDR'];

    return $con->twig->render($res,'index.html',["host"=>$host,"menu"=>$menu]);
});


$app->get('/footer',function(Request $req,Response $res){
    return $this->twig->render($res,'footer.html');
});


/**
 * login register route
 * body :
 * {
 *  "email":"example@gmail.com"
 * }
 */
$app->post('/api/v1/cek-email',function(Request $req,Response $res){
    $data = json_decode($req->getBody(),true);
    $query = $this->sql->fetchColumn('select email from anggota where email = :email',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
});


/**
 * register
 */
$app->post('/api/v1/register',function(Request $req,Response $res){
    $data = json_decode($req->getBody());
    $query = $this->sql->insert('anggota',(array) $data);
    return $res->withJson(['response'=>$query?true:false]);
});


/**
 * login
 */

$app->post('/api/v1/login',function(Request $req,Response $res){
    $data = json_decode($req->getBody(),true);
    $query = $this->sql->fetchRow('select * from anggota where email = :email and password = :password',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true,'data'=>$query]);
});

$app->get('/api/v1/semua-anggota',function(Request $req,Response $res){
    $query = $this->sql->fetchRowMany('select * from anggota');
    return $res->write(json_encode($query));
});

$app->get('/api/v1/lihat-kolom-anggota',function(Request $req,Response $res){
    $kolom = $this->sql->fetchRowMany("select column_name as nama from information_schema.columns where table_schema = '$this->db_name' and table_name = 'anggota' ");
    return $res->withJson($kolom);
});


/**
 * admin route
 */

$app->get('/admin',function(Request $req,Response $res){
    $stem = $this->sql->fetchRow('select * from stem');
    $edu_stem = $this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "edu_stem"');
    $this->twig->render($res,'admin.html',["stem"=>$stem,"edustem"=>$edu_stem]);
});


/**
 * STEM
 */
$app->get('/api/v1/lihat-stem',function(Request $req,Response $res){
    $stem = $this->sql->fetchRow('select * from stem');
    return $res->write(json_encode($stem));
});

$app->get('/api/v1/lihat-kolom-stem',function(Request $req,Response $res){
   return $res->withJson($this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "stem"'));
});

 $app->post('/api/v1/simpan-stem',function(Request $req,Response $res){
    $data = (array)json_decode($req->getBody());
    $query = $this->sql->replace('stem',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
 });

/**
 * EDU-STEM
 */

 $app->get('/api/v1/lihat-kolom-edu-stem',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "edu_stem"'));
 });

 $app->get('/api/v1/lihat-master-jenjang',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_jenjang'));
 });

 $app->get('/api/v1/lihat-master-kelas',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_kelas'));
});

$app->get('/api/v1/lihat-master-kategori',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_kategori'));
});

$app->get('/api/v1/lihat-master-jenis',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_jenis'));
});

/**
 * simpan file
 */
$app->post('/api/v1/simpan-file',function(Request $req,Response $res){
    $files = $req->getUploadedFiles();
    $myFile = $files['file'];
    $uploadFileName = $myFile->getClientFilename();
    $jenis = pathinfo($uploadFileName, PATHINFO_EXTENSION);
    
    $tujuan = '';
    switch($jenis){
        case 'png':
            $tujuan = 'images';
        break;
        case 'mp4':
            $tujuan = 'videos';
        break;
        case 'pdf':
            $tujuan = 'pdf';
        break;
    }

    if($myFile->getSize() == 0){
        return $res->withJson(['response'=>false,'info'=>'file rusak atau jenis file tidak diizinkan']);
    }else{
        $myFile->moveTo(__DIR__."/../assets/".$tujuan."/istem_".$tujuan."_".rand().".".$jenis);
        return $res->withJson($myFile->getError() === UPLOAD_ERR_OK?['response'=>true]:['response'=>false]);
    }
    
});


// lihat gambar
$app->get('/lihat/gambar/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/images/'.$args['nama'].'.png';
    return !file_exists($file)?$res->write('gambar gak ada'):$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE);
});

// lihat video
$app->get('/lihat/video/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/videos/'.$args['nama'].'.mp4';
    return file_exists($file)?$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE):$res->write('video gak ada');
});

// lihat pdf
$app->get('/lihat/pdf/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/pdf/'.$args['nama'].'.pdf';
    return !file_exists($file)?$res->write('pdf gak ada'):$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE);
});

// lihat semua gambar
$app->get('/api/v1/lihat-semua-gambar',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/images'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/gambar/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = '.png';
        $nama['path'] = __DIR__.'/../assets/images';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

// lihat semua video
$app->get('/api/v1/lihat-semua-video',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/videos'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/video/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = '.mp4';
        $nama['path'] = __DIR__.'/../assets/videos';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

// lihat semua pdf
$app->get('/api/v1/lihat-semua-pdf',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/pdf'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/pdf/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = ".pdf";
        $nama['path'] = __DIR__.'/../assets/pdf';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

$app->get('/lihat/icon/{nama}',function(Request $req,Response $res,$args){
    $nama = $args['nama'];
    $iconNya = '';
    if($nama == 'video'){
        $iconNya = file_get_contents(__DIR__.'/../assets/icons/video_icon.png');
    }else{
        $iconNya = file_get_contents(__DIR__.'/../assets/icons/pdf_icon.png');
    }

    return $res->write($iconNya)->withHeader('Content-Type',FILEINFO_MIME_TYPE);

});

$app->post('/api/v1/hapus-konten',function(Request $req,Response $res){
    $bodyNya = json_decode($req->getBody(),true);
    $targetNya = $bodyNya['path'];
    $apaAda = file_exists($targetNya);
    $jenisNya = pathinfo($targetNya,PATHINFO_EXTENSION);
    if(!$apaAda){
        return $req->witJson('gambar gk ada');
    }
    $dihapus = unlink($targetNya);
    return $res->withJson($dihapus?['response'=>true,"jenis"=>$jenisNya]:['response'=>false]);
});



 /**
  * handle page not found
  */

// $app->get('/{*}',function(Request $req,Response $res,$args){
//     return $this->twig->render($res,'page_not_found.html',['info'=>$args['apa']]);
// });

$app->run();
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Container;
use \Slim\App;
use \Slim\Views\Twig;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;

require __DIR__ .'/../vendor/autoload.php';

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$con = new Container($configuration);

$local = $_SERVER['REMOTE_ADDR'] == "127.0.0.1";

$con['sql'] = function()use($local){
    if($local){
        $pdo = new PDOConnector(
            'localhost',
            'root',
            'makuro123',
            'db_istem'
        );
        $pdoConn = $pdo->connect('utf8', []);
        $dbConn = new Mysql($pdoConn);
        return $dbConn;
    }else{
        $pdo2 = new PDOConnector(
            'localhost',
            'id13965788_root',
            'Makuro_12345',
            'id13965788_db_istem'
            );
        $pdoConn2 = $pdo2->connect('utf8', []);
        $dbConn2 = new Mysql($pdoConn2);
        return $dbConn2;
    }
};
$con['db_name'] = $local?'db_istem':'id13965788_db_istem';


// twig
$con['twig'] = function()use ($con){
    $view = new Twig(__DIR__.'/../views');
    $router = $con->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
    return $view;
};

// page not found handler
$con['notFoundHandler'] = function($con){
    return function ($request, $response) use ($con) {
        return $con->twig->render($response,'page_not_found.html');
    };
};

$app = new App($con);
$con = $app->getContainer();

$app->get('/install',function(Request $req,Response $res){
    $sql = <<<SQL
drop table if exists anggota;
create table if not exists anggota(
id int auto_increment primary key,
nama_depan varchar(199),
nama_belakang varchar(199),
panggilan varchar(199),
email varchar(199),
password varchar(199),
alamat varchar(199),
hp varchar(199),
jabatan varchar(199),
tanggal date
);
drop table if exists stem;
create table if not exists stem(
id int primary key,
judul varchar(199),
keterangan varchar(199),
gambar varchar(199),
video varchar(199),
isi text(199),
filenya varchar(199)
);
drop table if exists edu_stem;
create table if not exists edu_stem(
id int auto_increment primary key,
jenjang varchar(199),
kelas varchar(199),
kategori varchar(199),
jenis varchar(199),
judul varchar(199),
video varchar(199),
keterangan varchar(199),
gambar varchar(199),
isi text,
filenya varchar(199),
tanggal date
);
drop table if exists tentang;
create table if not exists tentang(
id int auto_increment primary key,
judul varchar(199),
gambar varchar(199),
video varchar(199),
keterangan varchar(199),
isi text,
pengembang text
);
drop table if exists master_jenjang;
create table if not exists master_jenjang(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists master_kelas;
create table if not exists master_kelas(
id int auto_increment primary key,
nama varchar(199),
id_kelas int(199)
);
drop table if exists master_jenis;
create table if not exists master_jenis(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists master_kategori;
create table if not exists master_kategori(
id int auto_increment primary key,
nama varchar(199)
);
drop table if exists stem_video;
create table if not exists stem_video(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
);
drop table if exists tampungan_video;
create table if not exists tampungan_video(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
);
drop table if exists tampungan_gambar;
create table if not exists tampungan_gambar(
id int auto_increment primary key,
nama varchar(199),
url varchar(199)
)

SQL;
    $query = $this->sql->executeSql($sql);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
});

$app->get('/set-master',function(Request $req,Response $res)use ($con){
   $sql = <<<SQL
insert into master_jenjang values
(1,"elementary school"),
(2,"junior hight school"),
(3,"senior hight school"),
(4,"hight education");
insert into master_kelas values
(1,"I",1),
(2,"II",1),
(3,"III",1),
(4,"IV",1),
(5,"V",1),
(6,"VI",1),
(7,"VII",2),
(8,"VIII",2),
(9,"IX",2),
(10,"X",3),
(11,"XI",3),
(12,"XII",3);
insert into master_kategori values
(1,"global warning"),
(2,"pressure"),
(3,"wave");
insert into master_jenis values
(1,"lesson plan"),
(2,"e-book"),
(3,"edukits"),
(4,"argumen reality"),
(5,"virtual relity"),
(6,"assessment"),
(7,"video implementasi");  
SQL;
    $query = $this->sql->executeSql($sql);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
    
});

$app->get('/',function(Request $req,Response $res)use ($con){
    $menu = [
       "ISTEM",
       "EDUSTEM",
       "EDU-CLASS",
       "EDU-GAME",
       "ARGUMENT-REALITY",
       "VIRTUAL-REALITY",
       "ABOUT"
    ];
    $host = $_SERVER['REMOTE_ADDR'];

    return $con->twig->render($res,'index.html',["host"=>$host,"menu"=>$menu]);
});


$app->get('/footer',function(Request $req,Response $res){
    return $this->twig->render($res,'footer.html');
});


/**
 * login register route
 * body :
 * {
 *  "email":"example@gmail.com"
 * }
 */
$app->post('/api/v1/cek-email',function(Request $req,Response $res){
    $data = json_decode($req->getBody(),true);
    $query = $this->sql->fetchColumn('select email from anggota where email = :email',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
});


/**
 * register
 */
$app->post('/api/v1/register',function(Request $req,Response $res){
    $data = json_decode($req->getBody());
    $query = $this->sql->insert('anggota',(array) $data);
    return $res->withJson(['response'=>$query?true:false]);
});


/**
 * login
 */

$app->post('/api/v1/login',function(Request $req,Response $res){
    $data = json_decode($req->getBody(),true);
    $query = $this->sql->fetchRow('select * from anggota where email = :email and password = :password',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true,'data'=>$query]);
});

$app->get('/api/v1/semua-anggota',function(Request $req,Response $res){
    $query = $this->sql->fetchRowMany('select * from anggota');
    return $res->write(json_encode($query));
});

$app->get('/api/v1/lihat-kolom-anggota',function(Request $req,Response $res){
    $kolom = $this->sql->fetchRowMany("select column_name as nama from information_schema.columns where table_schema = '$this->db_name' and table_name = 'anggota' ");
    return $res->withJson($kolom);
});


/**
 * admin route
 */

$app->get('/admin',function(Request $req,Response $res){
    $stem = $this->sql->fetchRow('select * from stem');
    $edu_stem = $this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "edu_stem"');
    $this->twig->render($res,'admin.html',["stem"=>$stem,"edustem"=>$edu_stem]);
});


/**
 * STEM
 */
$app->get('/api/v1/lihat-stem',function(Request $req,Response $res){
    $stem = $this->sql->fetchRow('select * from stem');
    return $res->write(json_encode($stem));
});

$app->get('/api/v1/lihat-kolom-stem',function(Request $req,Response $res){
   return $res->withJson($this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "stem"'));
});

 $app->post('/api/v1/simpan-stem',function(Request $req,Response $res){
    $data = (array)json_decode($req->getBody());
    $query = $this->sql->replace('stem',$data);
    return $res->withJson(is_null($query)?['response'=>false]:['response'=>true]);
 });

/**
 * EDU-STEM
 */

 $app->get('/api/v1/lihat-kolom-edu-stem',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select column_name as nama from information_schema.columns where table_name = "edu_stem"'));
 });

 $app->get('/api/v1/lihat-master-jenjang',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_jenjang'));
 });

 $app->get('/api/v1/lihat-master-kelas',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_kelas'));
});

$app->get('/api/v1/lihat-master-kategori',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_kategori'));
});

$app->get('/api/v1/lihat-master-jenis',function(Request $req,Response $res){
    return $res->withJson($this->sql->fetchRowMany('select * from master_jenis'));
});

/**
 * simpan file
 */
$app->post('/api/v1/simpan-file',function(Request $req,Response $res){
    $files = $req->getUploadedFiles();
    $myFile = $files['file'];
    $uploadFileName = $myFile->getClientFilename();
    $jenis = pathinfo($uploadFileName, PATHINFO_EXTENSION);
    
    $tujuan = '';
    switch($jenis){
        case 'png':
            $tujuan = 'images';
        break;
        case 'mp4':
            $tujuan = 'videos';
        break;
        case 'pdf':
            $tujuan = 'pdf';
        break;
    }

    if($myFile->getSize() == 0){
        return $res->withJson(['response'=>false,'info'=>'file rusak atau jenis file tidak diizinkan']);
    }else{
        $myFile->moveTo(__DIR__."/../assets/".$tujuan."/istem_".$tujuan."_".rand().".".$jenis);
        return $res->withJson($myFile->getError() === UPLOAD_ERR_OK?['response'=>true]:['response'=>false]);
    }
    
});


// lihat gambar
$app->get('/lihat/gambar/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/images/'.$args['nama'].'.png';
    return !file_exists($file)?$res->write('gambar gak ada'):$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE);
});

// lihat video
$app->get('/lihat/video/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/videos/'.$args['nama'].'.mp4';
    return file_exists($file)?$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE):$res->write('video gak ada');
});

// lihat pdf
$app->get('/lihat/pdf/{nama}',function(Request $req,Response $res,$args){
    $file = __DIR__.'/../assets/pdf/'.$args['nama'].'.pdf';
    return !file_exists($file)?$res->write('pdf gak ada'):$res->write(file_get_contents($file))->withHeader('Content-Type', FILEINFO_MIME_TYPE);
});

// lihat semua gambar
$app->get('/api/v1/lihat-semua-gambar',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/images'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/gambar/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = '.png';
        $nama['path'] = __DIR__.'/../assets/images';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

// lihat semua video
$app->get('/api/v1/lihat-semua-video',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/videos'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/video/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = '.mp4';
        $nama['path'] = __DIR__.'/../assets/videos';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

// lihat semua pdf
$app->get('/api/v1/lihat-semua-pdf',function(Request $req,Response $res){
    $data = array_diff(scandir(__DIR__.'/../assets/pdf'), ['..', '.']);
    $hasil = [];
    foreach($data as $key=>$val){
        $nama['nama'] = pathinfo($val,PATHINFO_FILENAME);
        $nama['lokasi'] = "/lihat/pdf/".pathinfo($val,PATHINFO_FILENAME);
        $nama['jenis'] = ".pdf";
        $nama['path'] = __DIR__.'/../assets/pdf';
        array_push($hasil,$nama);
    }
    return $res->withJson($hasil);
});

$app->get('/lihat/icon/{nama}',function(Request $req,Response $res,$args){
    $nama = $args['nama'];
    $iconNya = '';
    if($nama == 'video'){
        $iconNya = file_get_contents(__DIR__.'/../assets/icons/video_icon.png');
    }else{
        $iconNya = file_get_contents(__DIR__.'/../assets/icons/pdf_icon.png');
    }

    return $res->write($iconNya)->withHeader('Content-Type',FILEINFO_MIME_TYPE);

});

$app->post('/api/v1/hapus-konten',function(Request $req,Response $res){
    $bodyNya = json_decode($req->getBody(),true);
    $targetNya = $bodyNya['path'];
    $apaAda = file_exists($targetNya);
    $jenisNya = pathinfo($targetNya,PATHINFO_EXTENSION);
    if(!$apaAda){
        return $req->witJson('gambar gk ada');
    }
    $dihapus = unlink($targetNya);
    return $res->withJson($dihapus?['response'=>true,"jenis"=>$jenisNya]:['response'=>false]);
});



 /**
  * handle page not found
  */

// $app->get('/{*}',function(Request $req,Response $res,$args){
//     return $this->twig->render($res,'page_not_found.html',['info'=>$args['apa']]);
// });

$app->run();
```


### admin 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    {% include "header.twig" %}
</head>
<body class="container-fluid">
    <h1>ADMIN PANEL</h1>
    
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" data-toggle="tab" href="#id1" role="tab" aria-selected="true">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#id2" role="tab" aria-selected="false">STEM</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#id3" role="tab" aria-selected="false">EDU-STEM</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#id4" role="tab" aria-selected="false">FILE MANAGER</a>
        </li>
        
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane" id="id1" >
            HOME
        </div>
        <div class="tab-pane show active" id="id2" >
           {% include "stem.twig" %}
        </div>
        <div class="tab-pane " id="id3">
            {% include "edu_stem.twig" %}
        </div>
        <div class="tab-pane " id="id4">
            {% include "file_manager.twig" %}
        </div>
      </div>
      
      <script>


        $('.form-control').keydown(function (e) {
            if (e.which === 13) {
                var index = $('.form-control').index(this) + 1;
                $('.form-control').eq(index).focus();
            }
        });

        $('#edu-simpan').click(()=>{
            var pak = $('.edu-stem');
            var data  = [];
            for(var i =0;i< pak.length;i++){
                data.push(pak[i].id)
            }
            console.log(data)
            
            
        })

      </script>
</body>
</html>
```

### stem

```html
<div id="row-stem" class="p-3 container-fluid">
    <div class="row py-2">
        <h3 class="col">STEM</h3>
        <div class="prefix">
            <button id="btn-update-stem" class="btn btn-primary float-right">UPDATE</button>
        </div>
    </div>
    <div class="border rounded p-2">
        <div id="carouselExampleControls" class="carousel slide " data-ride="carousel" >
            <div id="con-slide" class="carousel-inner"></div>
           
            <a class="carousel-control-prev bg-light border" href="#carouselExampleControls"  data-slide="prev"></a>
            <a class="carousel-control-next bg-light border" href="#carouselExampleControls"  data-slide="next"></a>
        </div>
    </div>


</div>

<div id="row-edit-stem" class="p-3 container-fluid">
    <h3>EDIT STEM</h3>
    <div class="form-group">
        <span>JUDUL</span>
        <input id="judul" class="form-control" type="text" placeholder="judul" value="{{ stem.judul }}">
    </div>
    <div class="form-group">
        <span>VIDEO URL</span>
        <input id="url-video" class="form-control" data-toggle="modal" data-target="#pil-video" type="text" placeholder="id video" value="{{ stem.video }}">
        <div id="pil-video" class="modal">
            <div class="modal-dialog">
                <div id="isi-pil-video" class="modal-content p-4 "></div>
            </div>

        </div>
    </div>

    <div class="form-group ">
        <span>GAMBAR URL</span>
        <input id="url-gambar" class="form-control" data-toggle="modal" data-target="#pil-gambar" type="text" placeholder="url gambar" value="{{ stem.gambar }}">
    </div>
    <div id="pil-gambar" class="modal">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div id="isi-pil-gambar" class="row"></div>
            </div>
        </div>
    </div>

    <div class="form-group">
        <span>PDF URL</span>
        <input id="url-pdf" data-toggle="modal" data-target="#pil-pdf" class="form-control" type="text" placeholder="url file" value="{{ stem.filenya }}">
    </div>
    <div id="pil-pdf" class="modal">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div id="isi-pil-pdf" class="row"></div>
            </div>
        </div>
    </div>

    <div class="form-group">
        <span>KETERANGAN</span>
        <input id="keterangan" class="form-control" type="text" placeholder="keterangan" value="{{ stem.keterangan }}">
    </div>
   
    <div class="form-group">
        <span>KONTENT</span>
        <textarea id="isi-konten" class="form-control" cols="30" rows="10" placeholder="isi konten" value="{{ stem.isi }}">{{ stem.isi }}</textarea>
    </div>
    <div class="prefix py-3">
        <button id="batal-update-stem" class="btn btn-danger">BATAL</button>
        <button id="simpan-stem" class="btn btn-primary float-right">SIMPAN</button>
    </div>
</div>

<script>

    // tombol update stem
    $('#row-edit-stem').hide()
    $('#btn-update-stem').click(()=>{
      $('#row-edit-stem').show();
      $('#row-stem').hide();
    });

    // tombol batal update stem
    $('#batal-update-stem').click(()=>{
        $('#row-edit-stem').hide();
        $('#row-stem').show();
      })

    $(async ()=>{

        // lihat kontent stem
        var stemNya = await $.get('/api/v1/lihat-stem');
        var stm = JSON.parse(stemNya);
        var videoNya = stm.video.split(',')
        var itmSlid = '';
        for(var i = 0;i< videoNya.length;i++){
            itmSlid += `
                <div class="carousel-item ${i == 0?'active':''}">
                    <div class="justify-content-center row">
                        <video controls>
                            <source src="${videoNya[i]}" type="video/mp4">
                        </video>
                    </div>
                </div>
            `;
        }
        $('#con-slide').html(itmSlid)
        


        var vid = await $.get('/api/v1/lihat-semua-video');
        var iconVid = await $.get('/lihat/icon/video');
        
        var kon = '';
        for(var i = 0 ;i < vid.length;i++){
            kon += `
                <div class=" border m-1 p-2 row">
                    <img class="col-md-2 img-fluid" src="/lihat/icon/video">
                    <div class="clk-video col-10 btn btn-light text-truncate" onclick="ambilDataVideo('${vid[i].lokasi}')">${vid[i].lokasi}.mp4</div>
                </div>
            `;
        }
        $('#isi-pil-video').html(kon)
       
        // pilih gambar
        var gam = await $.get('/api/v1/lihat-semua-gambar');
        console.log(gam)
        var conGam = ''
        for(var i = 0;i<gam.length;i++){
            conGam += `
                <div class="col-md-3 btn d-block m-1 p-2 bg-light rounded">
                    <img class="w-100" src="${gam[i].lokasi}" onclick="ambilDateGambar('${gam[i].lokasi}')">
                </div>
            `;

        }
        $('#isi-pil-gambar').html(conGam)

        // pilih pdf
        var pdf = await $.get('/api/v1/lihat-semua-pdf');
        console.log(pdf)
        var conPdf = ''
        for(var i = 0;i<pdf.length;i++){
            conPdf += `
                <div class=" border m-1 p-2 row">
                    <img class="col-md-2 img-fluid" src="/lihat/icon/pdf">
                    <div class="clk-video col-10 btn btn-light text-truncate" onclick="ambilDataPdf('${pdf[i].lokasi}')">${pdf[i].lokasi}.pdf</div>
                </div>
            `;

        }
        $('#isi-pil-pdf').html(conPdf)



        // tombol simpan stem
        $('#simpan-stem').click(()=>{
            const judul = $('#judul'),
            urlVideo = $('#url-video'),
            urlGambar = $('#url-gambar'),
            keterangan = $('#keterangan'),
            urlFile = $('#url-pdf'),
            isiKonten = $('#isi-konten')

            if(
                judul.val() == "" ||
                urlVideo.val() == "" ||
                urlGambar.val() == "" ||
                keterangan.val() == "" ||
                urlFile.val() == "" ||
                isiKonten.val() == ""
            ){
                alert('baiknya jangan ada yang kosong');
                return;
            }

            const paket = {
                "id":1,
                "judul":judul.val(),
                "video":urlVideo.val(),
                "gambar":urlGambar.val(),
                "keterangan":keterangan.val(),
                "isi":isiKonten.val(),
                "filenya":urlFile.val()
            }

            $.post('/api/v1/simpan-stem',JSON.stringify(paket),(a,b)=>{
                alert(a.response)
                window.location.reload()
            });
        });

    })

    var nil = [];
    function ambilDataVideo(e){
        if($('#url-video').val() == "") nil = []
        nil.push(e)
        $('#pil-video').modal('hide')
        $('#url-video').val(nil)
    }

    function ambilDateGambar(e){
        $('#pil-gambar').modal('hide')
        $('#url-gambar').val(e)
    }

    function ambilDataPdf(e){
        $('#pil-pdf').modal('hide')
        $('#url-pdf').val(e)
    }

   
</script>
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>I-Stem</title>
    {% include "header.twig" %}

</head>
<body class="container-fluid">
    {{ host }}
    
    <div class="container d-block p-3">
        <div class="prefix row">
            <h1 class="col">I-Stem</h1>
            <div class="col"> 
                <a class="float-right btn  btn-primary mx-1" href="/admin">ADMIN</a>
                <button class="btn  btn-danger" id="logout">logout</button>
            </div>
            
        </div>
    </div>

    <h3 class="d-block" id="usr"></h3>
    
    <div id="row-nav" class="container row p-2">
        <div class="nav flex-column nav-pills col-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
           {% for key,men in menu %}
                {% if key == 0 %}
                    <a class="nav-link bg-light text-dark active" data-toggle="pill" href="#tab_{{ men }}"><h4>{{ men }}</h4></a>
                {% else %}
                    <a class="nav-link bg-light text-dark" data-toggle="pill" href="#tab_{{ men }}"><h4>{{ men }}</h4></a>
                {% endif %}
           {% endfor %}
        </div>
        <div class="tab-content col-8" id="">
            {% for key,mn in menu %}
                {% if key == 0 %}
                    <div id="tab_{{ mn }}" class="tab-pane show active">{{ mn }}</div>
                {% else %}
                    <div id="tab_{{ mn }}" class="tab-pane">{{ mn }}</div>
                {% endif %}
            {% endfor %}
        </div>
    </div>
    <div id="auth" class="">
        <div class="container bg-light ">
            <div id="row-login" class="" >
                <h1>Login</h1>
                <div class="p-4">
                    <div class="form-group">
                        <input id="lg-email" class="form-control" type="text" placeholder="email">
                    </div>
                    <div class="form-group">
                        <input id="lg-password" class="form-control" type="text" placeholder="password">
                    </div>
                    <div class="prefix">
                        <button id="btn-login" class="btn float-right btn-primary">Login</button>
                    </div>
                    <div>
                        jika anda belum memiliki akun silahkan <Span id="regis" class="btn text-primary">REGISTER</Span>
                    </div>
                </div>
            </div>
            <div id="row-register" class="">
                <h1>Register</h1>
                <div class="p-4">
                    <div class="form-group">
                        <input id="nama-depan" class="form-control" type="text" placeholder="nama depan" >
                    </div>
                    <div class="form-group">
                        <input id="nama-belakang" class="form-control" type="text" placeholder="nama belakang" >
                    </div>
                    <div class="form-group">
                        <input id="panggilan" class="form-control" type="text" placeholder="panggilan" >
                    </div>
                    <div class="form-group">
                        <input id="email" class="form-control" type="text" placeholder="email">
                    </div>
                    <div class="form-group">
                        <input id="password" class="form-control" type="text" placeholder="password" >
                    </div>
                    <div class="form-group">
                        <input id="alamat" class="form-control" type="text" placeholder="alamat" >
                    </div>
                    <div class="form-group">
                        <input id="hp" class="form-control" type="text" placeholder="nomer hanphone" >
                    </div>
                    <div class="form-group">
                        <input id="jabatan" list="jbt" class="form-control" type="text" placeholder="jabatan">
                        <datalist id="jbt">
                            <option value="student">
                            <option value="teacher">
                          </datalist>
                    </div>
                    <div class="prefix">
                        <button id="btn-register" class="btn btn-primary float-right">Register</button>
                    </div>
                    <div class="prefix">
                        jika anda telah memiliki akun silahkan <span id="log" class="btn text-primary">LOGIN</span>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script>
        $('#row-login').hide();
        $('#row-register').hide();
        $('#konten').hide()
        $('#logout').hide()

        var user = window.localStorage.getItem('user');
        if(user == null){
            $('#row-login').show()
            $('#row-nav').hide()
        }else{
            $('#row-login').hide();
            $('#row-register').hide();
            $('#konten').show()
            //$('#usr').html(`halo  ${JSON.parse(window.localStorage.getItem('user')).nama}`);
            $('#logout').show()
            $('#row-nav').show()
        }

        $('#regis').click(()=>{
            $('#row-register').show();
            $('#row-login').hide();
        })
        $('#log').click(()=>{
            $('#row-register').hide();
            $('#row-login').show();
        })


        // register
        $('#btn-register').click(()=>{
            var namaDepan = $('#nama-depan'),
            namaBelakang = $('#nama-belakang'),
            panggilan = $('#panggilan'),
            email = $('#email'),
            password = $('#password'),
            alamat = $('#alamat'),
            hp = $('#hp'),
            jabatan = $('#jabatan') 

            if(
                namaDepan.val() == "" ||
                namaBelakang.val() == "" ||
                panggilan.val() == "" ||
                email.val() == "" ||
                password.val() == "" ||
                alamat.val() == "" ||
                hp.val() == "" ||
                jabatan.val() == ""
            ){
                alert('gak bole ada yang kosong');
                return;
            }

            const paket = {
                "nama_depan":namaDepan.val(),
                "nama_belakang":namaBelakang.val(),
                "panggilan":panggilan.val(),
                "email":email.val(),
                "password":password.val(),
                "alamat":alamat.val(),
                "hp":hp.val(),
                "jabatan":jabatan.val(),
                "tanggal": new Date().toISOString().slice(0, 19).replace('T', ' ')
            }

            // cek email
            const eml = {"email":email.val()};
            $.post('/api/v1/cek-email',JSON.stringify(eml),(a,b)=>{
                if(a.response){
                    alert('email telah digunakan , anda bisa langsung login');
                    return;
                }
               

                $.post('/api/v1/register',JSON.stringify(paket),(a,b)=>{
                    console.log(a);
                    if(a){
                        $('#row-register').hide();
                        $('#row-login').show();
                    }
                })
            });

        })

        // next ketika enter
        $('.form-control').keydown(function (e) {
            if (e.which === 13) {
                var index = $('.form-control').index(this) + 1;
                $('.form-control').eq(index).focus();
            }
        });

        // login
        $('#btn-login').click(()=>{
            var email = $('#lg-email'),
            password = $('#lg-password')

            if(
                email.val() == "" ||
                password.val() == ""
            ){
                alert ('gak bole ada yang kosong');
                return;
            }

            var paket = {
                "email":email.val(),
                "password":password.val()
            }
            $.post('/api/v1/login',JSON.stringify(paket),(a,b)=>{
                console.log(a);
                if(!a.response){
                    alert('email atau password tidak terdaftar');
                    return;
                }
                
                var data = a.data
                window.localStorage.setItem('user',data);
                window.location.reload();
            });
        });

        $('#logout').click(()=>{
            window.localStorage.removeItem('user');
            window.location.reload();
        })

        
        
    </script>
</body>
</html>
```

### file manager

```html


<div class="container-fluid my-2">
    <div class="p-3 border">
        <h3>upload</h3>
        <div class="d-block my-2">
            <select id="upl-pilih" class="btn btn-light border">
                <option class="form-control" value="0">PILIH JENIS FILE</option>
                <option class="form-control" value="1">GAMBAR</option>
                <option class="form-control" value="2">VIDEO</option>
                <option class="form-control" value="3">PDF</option>
            </select>
        </div>
        <div id="upl-con">
            <label id="lbl" class="btn btn-primary" for="upl-gambar">UPLOAD GAMBAR</label>
            <input id="upl-gambar" class="form-control d-none" name="file" type="file" accept="image/x-png" onchange="uploadFile(this)">
        </div>
    </div>
    <div class="my-2">
        <div class="p-3 border my-2">
            <div class="d-block"><h3>semua gambar</h3></div>
            <div id="all-gambar" class="row"></div>
       </div>
       <div class="p-3 border my-2">
            <div><h3>semua video</h3></div>
            <div id="all-video" class="row"></div>
       </div>
       <div class="p-3 border my-2">
            <div class="d-block"><h3>semua pdf</h3></div>
            <div id="all-pdf" class="row"></div>
       </div>
        
    </div>
</div>



<script>
    $('#lbl').hide()
    $('#upl-pilih').on('change',(e)=>{
        const valNya = $('#upl-pilih').val();
        
        var acc = '';
        var judul = '';
        var jenis = '';
        switch(valNya){
            case '1':
                acc = 'image/png';
                judul = 'UPLOAD GAMBAR';
                jenis = 'png';
            break;
            case '2':
                acc = 'video/mp4';
                judul = 'UPLOAD VIDEO';
                jenis = 'mp4';
            break;
            case '3':
                acc = 'application/pdf';
                judul = 'UPLOAD PDF';
                jenis = 'pdf';
            break;
        }

        $('#lbl').show()
        $('#lbl').html(judul);
        $('#upl-gambar').attr('accept',acc);
       
    });

    // upload file
    function uploadFile(e){
        var fileNya = e.files[0];
        var typeNya = fileNya.type;
        var formData = new FormData();
        formData.append('file',fileNya)
        
        $.ajax({
            url:'/api/v1/simpan-file',
            type:'POST',
            data:formData,
            processData: false,
            contentType: false,
            success:(data)=>{
                if(data.response){
                    
                    switch(typeNya){
                        case 'image/png':
                            lihatSemuaGambar();
                        break;
                        case 'video/mp4':
                            lihatSemuaVideo();
                        break;
                        case 'application/pdf':
                            lihatSemuaPdf();
                        break;
                    }
                }else{
                    alert('gagal mengupload '+JSON.stringify(data))
                }
                
                
            }
        });

    }

    lihatSemuaGambar();
    function lihatSemuaGambar(){
        $(async ()=>{
            var semuaGambar = await $.get('/api/v1/lihat-semua-gambar');
            var tampil = '';
            for(var i =0;i<semuaGambar.length;i++){
                var path = `${semuaGambar[i].path}/${semuaGambar[i].nama}${semuaGambar[i].jenis}`
                tampil += `
                <div class="col-md-2 m-1">
                    <div class="border rounded">
                        <div class=" hapus float-right badge badge-danger btn mb-2" onclick="hapusKonten('${path}')">X</div>
                        <div class="p-2">
                            <img class="w-100 img-fluid " src='${semuaGambar[i].lokasi}'>
                            <div class="text-truncate">${semuaGambar[i].nama}</div>
                        </div>
                    </div>
                </div>
                `
            }
            $('#all-gambar').html(tampil)
        })
    }

    lihatSemuaVideo();
    function lihatSemuaVideo(){
        $(async ()=>{
            var semuaVideo = await $.get('/api/v1/lihat-semua-video');
            var iconVideo = await $.get('/lihat/icon/video');
            
            var tampil = '';
            for(var i =0;i<semuaVideo.length;i++){
                var path = `${semuaVideo[i].path}/${semuaVideo[i].nama}${semuaVideo[i].jenis}`
                tampil += `
                <div class="col-md-2 m-1">
                    <div class="border rounded">
                        <div class="hapus float-right badge badge-danger btn mb-2" onclick="hapusKonten('${path}')">X</div>
                        <div class="p-2">
                            <img class="w-100 img-fluid " src='/lihat/icon/video'>
                            <div class="text-truncate">${semuaVideo[i].nama}</div>
                        </div>
                    </div>
                </div>
                `;
            }
            $('#all-video').html(tampil)
        })
    }

    lihatSemuaPdf();
    function lihatSemuaPdf(){
        $(async ()=>{
            var semuaPdf = await $.get('/api/v1/lihat-semua-pdf');
            var iconVideo = await $.get('/lihat/icon/video');
            var tampil = '';
            for(var i =0;i<semuaPdf.length;i++){
                var path = `${semuaPdf[i].path}/${semuaPdf[i].nama}${semuaPdf[i].jenis}`
                tampil += `
                <div class="col-md-2 m-1">
                    <div class="border rounded">
                        <div class="hapus float-right badge badge-danger btn mb-2" onclick="hapusKonten('${path}')">X</div>
                        <div class="p-2">
                            <img class="w-100 img-fluid " src='/lihat/icon/pdf'>
                            <div class="text-truncate">${semuaPdf[i].nama}</div>
                        </div>
                    </div>
                </div>
                `;
            }
            $('#all-pdf').html(tampil)
        })
    }

    function hapusKonten(e){
       $(async ()=>{
            var paket = {'path':e}
            var hasil = await $.post('/api/v1/hapus-konten',JSON.stringify(paket));
            if(hasil.response){
                switch(hasil.jenis){
                    case 'png':
                        lihatSemuaGambar();
                    break;
                    case 'mp4':
                        lihatSemuaVideo();
                    break;
                    case 'pdf':
                        lihatSemuaPdf();
                    break;
                }
            }
       })
       
    }

    
    
    
</script>

```




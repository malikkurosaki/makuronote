# istem backup 

```php
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
$app = new App($con);
$con = $app->getContainer();

$local = $_SERVER['SERVER_NAME'] == "192.168.43.57";

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
            'sql212.epizy.com',
            'epiz_25894173',
            '0F6YZXwi6ARQ',
            'epiz_25894173_db_istem'
            );
        $pdoConn2 = $pdo2->connect('utf8', []);
        $dbConn2 = new Mysql($pdoConn2);
        return $dbConn2;
    }
};
$con['db_name'] = $local?'db_istem':'epiz_25894173_db_istem';

$con['twig'] = function()use ($con){
    $view = new Twig(__DIR__.'/../views');
    $router = $con->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
    return $view;
};

$app->get('/install',function(Request $req,Response $res){
    $sql = <<<SQL
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
create table if not exists stem(
id int primary key,
judul varchar(199),
keterangan varchar(199),
gambar varchar(199),
video varchar(199),
isi text(199),
filenya varchar(199)
);
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
create table if not exists tentang(
id int auto_increment primary key,
judul varchar(199),
gambar varchar(199),
video varchar(199),
keterangan varchar(199),
isi text,
pengembang text
);
create table if not exists master_jenjang(
id int auto_increment primary key,
nama varchar(199)
);
create table if not exists master_kelas(
id int auto_increment primary key,
nama varchar(199),
id_kelas int(199)
);
create table if not exists master_jenis(
id int auto_increment primary key,
nama varchar(199)
);
create table if not exists master_kategori(
id int auto_increment primary key,
nama varchar(199)
);
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
    $res->write($query);
});

$app->get('/uninstall',function(Request $req,Response $res)use ($con){

$sql = <<<SQL
drop table anggota;
drop table stem;
drop table edu_stem;
drop table tentang;
drop table master_jenjang;
drop table master_kelas;
drop table master_jenis;
drop table master_kategori;
SQL;

$query = $this->sql->executeSql($sql);
$res->write($query);

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
    $host = $_SERVER['SERVER_NAME'];

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
    $data = json_decode($req->getBody());
    $query = $this->sql->fetchColumn('select email from anggota where email = :email',(array) $data);
    if(is_null($query)){
        return $res->withJson(['response'=>false]);
    }else{
        return $res->withJson(['response'=>true]);
    }

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
    if(is_null($query)){
        return $res->withJson(['response'=>false]);
    }else{
        return $res->withJson(['response'=>true,'id'=>$query['id']]);
    }

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
    return $res->write(json_encode($query));
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
  * handle page not found
  */

$app->get('/{apa}',function(Request $req,Response $res,$args){
    return $this->twig->render($res,'page_not_found.html',['info'=>$args['apa']]);
});

$app->run();
```

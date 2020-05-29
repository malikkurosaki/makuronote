# slim php mysql dan twig

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
$con = new Container();
$app = new App($con);
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
        'localhost',
        'root',
        'makuro123',
        'panduan_flutter'
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

$app->get('/',function(Request $req,Response $res){
    $hasil = $this->sql->fetchRowMany('select * from konten');
    return $this->twig->render($res,'index.html',["konten"=>$hasil]);
});


$app->get('/adm',function(Request $req,Response $res)use ($con){
    $hasil = $this->sql->fetchRowMany('select * from konten');
    return $con->twig->render($res,'adm.html',["konten"=>$hasil]);
});

$app->post('/konten-baru',function(Request $req,Response $res)use($con){
    $paket = json_decode($req->getBody());
    $simpan = $this->sql->insert('konten',(array) $paket);
    return $res->write($simpan);
});

/**
 * update content
 */
$app->post('/update-konten',function(Request $req,Response $res)use($con){
    $data = json_decode($req->getBody());
    $update = $this->sql->update('konten',(array) $data->id,(array) $data->paket);
    return $res->write($update);
});

$app->post('/hapus-konten',function(Request $req,Response $res,$args)use($con){
    $id = json_decode($req->getBody());
    $hapus = $this->sql->delete('konten',(array)$id);
    return $res->write($hapus);
});

$app->run();
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    {% include 'header.html' %}
</head>
<body>
    <h1>Admin Panel</h1>
    

    <div class="container-fluid">
        <div class="p-2 bg-light">
            <div class="nav flex-row">
                <a class="nav-link  active" id="home-tab" data-toggle="pill" href="#home" aria-selected="true">Home</a>
                <a class="nav-link " id="new-post-tab" data-toggle="pill" href="#new-post" aria-selected="false">New Post</a>
                <a class="nav-link " id="messages-tab" data-toggle="pill" href="#messages" aria-selected="false">Messages</a>
                <a class="nav-link " id="settings-tab" data-toggle="pill" href="#settings" aria-selected="false">Settings</a>
            </div>
        </div>
        <div class="col-9 bg-white">
            <div class="tab-content" >
                <div class="tab-pane  show active" id="home">{% include 'semua_post.html' %}</div>
                <div class="tab-pane" id="new-post" >{% include 'new_post.html' %}</div>
                <div class="tab-pane" id="messages" >Message</div>
                <div class="tab-pane" id="settings" >Setting</div>
            </div>
        </div>
    </div>
    <script>
        $('#new-post-tab').click(()=>{
            $('#update').hide()
            $('#simpan').show()
            $('#title').html('New Post')
            $('#idnya').hide()
        })
    </script>
</body>
</html>
```

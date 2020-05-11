# upload image

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



$app->get('/', function (Request $req,  Response $res, $args = []) {
    $sql = <<<SQL
select * from isi
SQL;
    return view()->render($res,'index.html',['data'=>getData($sql)]);
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
        echo true;
    }else{
        echo false;
    }
    
});

$app->run();
```

```html

<div class="container">
    <div class="column">
        <div class="card">
            <div class="card-header">
                <h1>new post</h1>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="title">
                </div>
                <div class="form-group row container">
                    <div class="">
                        <div><strong>Upload gambar</strong></div>
                        <input id="img" type="file" name="file" class="file">
                    </div>
                    <div class="">
                        <div class=""><strong>pilih gambar</strong></div>
                        <button type="button" class="btn btn-light" data-toggle="modal" data-target="#mymodal">pilih gambar</button>
                        <div class="modal" id="mymodal">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="p-4">
                                        apa kabar
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <textarea class="form-control" rows="5" placeholder="description here">
                    </textarea>
                </div>
                <div class="form-group clear-fix">
                    <button class="btn float-right btn-light px-5">save</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>

    $('#img').on('change',(e)=>{
        var formData = new FormData();
        formData.append('file', $('#img')[0].files[0]);

        $.ajax({
            url:'/simpan-gambar',
            type:'POST',
            data:formData,
            processData: false,
            contentType: false,
            success:(data)=>{
                console.log(data) 
            }
        })

        
    })
</script>

```


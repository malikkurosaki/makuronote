# complete server

index.html
```html
{% include "header.html" %}
   <div class=" p-3 bg-light">
       <div class="display-4">AL-JABAR</div>
   </div>
   <div id="dialog"></div>

    <div class="container h-100">
        {% if res is defined %}
            {% if res == true %}
                <a href="/" class="display-3">
                    <span class="mdi mdi-arrow-left-circle"></span>
                </a>
                {% include  halaman %}
            {% else %}
                <div class="display-4">halaman kosong</div>
            {% endif %}
        {% else %}
            {% include "home.html" %}
        {% endif %}
   
    </div>

    <script>

    async function theTable(table,id){
        var tbl = await $.get('/lihat/'+table);

        if(!tbl.res){
            $(`#${id}`).html(`<button onclick="baruAtauUpdate('new','${table}')" class="btn btn-outline-success px-5 my-1" >new</button>`)
        }else{
           
            var tb = ''
            tb += `<div class="display-4">${table}</div>`
            tb += `<div class="d-inline-flex align-items-center">`
            tb += `<button onclick="baruAtauUpdate('new','${table}',null)" class="btn btn-outline-success px-5 my-1" >new</button>`
            tb += `<div class="form-inline bg-light px-4"><div class="col-4">search</div><input id="${table}-cari" class="form-control col-8" placeholder="ed : nama"></div>`
            tb += `<div class="mx-4">Total : ${tbl.data.length} ${table}</div>`
            tb += `</div>`
            tb += `<div id="con-table"></div>`
            $(`#${id}`).html(tb)
            theTableNya(table,id);
            $(`#${table}-cari`).keyup(()=>{
                theTableNya(table,id,$(`#${table}-cari`).val())
            })
        }

    }

    async function theTableNya(table,id,kunci){

        var tbl = await $.get('/lihat/'+table);
        var header = Object.keys(tbl.data[0])
        /* live search */
        if(kunci != undefined && kunci != ""){
            tbl = await $.get('/search/'+table+'/'+kunci);
            if(!tbl.res){
              tbl.data = []  
            }
        }
        
        var tableNya = "";
        tableNya += `<table class="table table-sm shadow table-hover border">`
        tableNya += `<tr class="bg-success text-white-50">`
        tableNya += `<th >action</th>`
        for(var i = 0;i< header.length;i++){
            tableNya += `<th>${header[i]}</th>`
        }
        tableNya += `</tr>`

        for (var i = 0;i< tbl.data.length;i++){
            tableNya += `<tr>`
            tableNya += `
            <td>
                <div class="dropdown">
                    <button class="dropdown-toggle badge-pill border " data-toggle="dropdown" aria-haspopup="true">...</button>
                    <div class="dropdown-menu p-2 bg-dark" aria-labelledby="dropdownMenuButton">
                        <btn class="btn btn-danger btn-block disabled" onclick="hapus('${table}','${tbl.data[i].id}')">hapus</btn>
                        <btn class="btn btn-warning btn-block disabled" onclick="baruAtauUpdate('update','${table}','${encodeURI(JSON.stringify(tbl.data[i].id))}')">update</btn>
                    </div>
                </div>
            </td>`
            for(var y = 0; y < header.length;y++){
                tableNya += `<td class="p-2 border-bottom">${header[y] == 'id'?table.split("")[0]+table.split("")[1]+table.split("")[2] +'-000'+tbl.data[i][header[y]]:tbl.data[i][header[y]]}</td>`
            }
            
            tableNya += `</tr>`
        }
        tableNya += `</table>`
        $(`#con-table`).html(tableNya);
    }

    async function hapus(t,e){
        if(true){
            alert('perlu ijin khusus')
            return;
        }
        var paket = {
            "table": t,
            "id": e
        }
        var hps = await $.post('/hapus',JSON.stringify(paket));
        if(hps.res){
            theTable(t,"cst");
        }
    }

    async function baruAtauUpdate(jenis,table,id){
        if(jenis == "update"){
            alert('perlu ijin khusus')
            return
        }
        let dat = await $.post('/kolom',JSON.stringify({"table": table}));
        var kun = {}
        if(jenis == "new"){
            for(var a of dat){
                kun[a['nama']] = ""
            }
        }else{
            let upd = await $.get(`/cari/${table}/${JSON.parse(decodeURI(id))}`)
            kun = upd
        }
        
        delete kun.id;
        delete kun.tanggal;

        let _kunci = Object.keys(kun)
        let _val = Object.values(kun)

        var template = ""
        template += 
        `
        <div id="baru-atau-update" role="dialog" aria-hidden="true" class="modal fade">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="display-4">${table} ${jenis} </div>
                <div class="bg-light p-3" >
        `
        for(var i = 0; i < _kunci.length; i++){
            template += 
            `
            <div class="form-inline p-1">
                <div class="col-4">${_kunci[i]}</div>
                <input class="col-8 form-control ${table}-input" value="${_val[i]}">
            </div>
            `
        }

        template += 
        `
            <button id="${table}-simpan" class="btn btn-primary align-self-end btn-block mt-5">SIMPAN</button>
        </div></div></div></div>
        `

        $('#dialog').html(template)

        $('#baru-atau-update').modal('show')

        $(`#${table}-simpan`).click( async ()=>{
            var isiNya = $(`.${table}-input`)
            var thePaket = {}
            var kosong = false;
            var hasil = false;
            thePaket["table"] = table;
            thePaket['data'] = {}
            for( var d = 0; d < _kunci.length;d++){
                thePaket["data"][_kunci[d]] = isiNya[d].value
                if(isiNya[d].value == "") kosong = true;
            }

            if(kosong){
                alert('jangan ada yang kossong')
                return
            }
            
            if(jenis == "new"){
                let res = await $.post('/simpan',JSON.stringify(thePaket))
                //$('#baru-atau-update').modal('hide')
                if(res.res){
                    window.location.reload()
                }
            }else{
                thePaket["id"] = JSON.parse(decodeURI(id))
                let res = await $.post('/update',JSON.stringify(thePaket))
                //$('#baru-atau-update').modal('hide')
                if(res.res){
                    window.location.reload()
                }
            }

        })
        
    }

    async function formTable(table,id){
        theTable(table,id);
        // var lsk = await $.post('/kolom',JSON.stringify(
        //     {
        //         "db": database,
        //         "table": table
        //     }
        // ))

        // lsk = lsk.filter(function(el) { return el.nama != "id" && el.nama != "tanggal" });
        // var template = '<div id="baru-atau-update" role="dialog" aria-hidden="true" class="card modal fade">'
        // template+= `<div class="modal-dialog" role="document"><div class="modal-content">`
        // template += `<div class="display-4">Insert ${table}</div>`
        // template += '<div class="bg-light p-3" >'
        // for(var i = 0; i < lsk.length; i++){
        //     template += 
        //         `
        //         <div class="form-inline p-2">
        //             <div class="col-4">${lsk[i]['nama']}</div>
        //             <input id="${table}-${lsk[i]['nama']}" placeholder="${lsk[i]['nama']} " class="form-control col-8 paket">
        //         </div>
        //         `
        //     }
        // template += `<button id="${table}-simpan" class="btn btn-primary align-self-end btn-block mt-5">SIMPAN</button>`
        // template += '</div></div></div></div>'
        // $(`#${id}`).append(template)

        // /* simpan data */
        // $(`#${table}-simpan`).click( async ()=>{
        //     var paket = {}
        //     var kosong = false;
        //     for(var x = 0; x < lsk.length;x++){
        //         if($(`#${table}-${lsk[x]['nama']}`).val() == "") kosong = true;
        //         paket[lsk[x]['nama']] = $(`#${table}-${lsk[x]['nama']}`).val()
        //     }

        //     if(kosong){
        //         alert ('jangan ada yang kosong');
        //         return;
        //     }
        //     var res = await $.post('/simpan',JSON.stringify({"table": table,"data": paket}));
        //     if(res.res){
        //         $('.paket').val('')
        //         $('#baru-atau-update').modal('hide')
        //         setTimeout(()=>{
        //             formTable(database,table,id)
        //         },500)
        //     }else{
        //         alert("data gagal disimpan")
        //     }
        // })

    }
        

    </script>
    
    {% include "footer.html" %}

```

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

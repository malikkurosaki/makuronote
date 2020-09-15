# slim php display image

```php
$app->get('/image/p/{data:\w+}', function($request, $response, $args) {
    $data = $args['data'];
    $image = @file_get_contents("http://localhost/main/media/image/p/$data");
    if($image === FALSE) {
        $handler = $this->notFoundHandler;
        return $handler($request, $response);    
    }
    
    $response->write($image);
    return $response->withHeader('Content-Type', FILEINFO_MIME_TYPE);
});
```


### update

```php
 public function semuaGambar($req,$res,$args){
        $gam = scandir('../public/uploads');
        $gam = array_diff($gam,array('.','..'));
        $hasil = [];
        foreach($gam as $a){
            array_push($hasil,["nama"=>$a]);
        }
        return $res->withJson($hasil);
    }
```

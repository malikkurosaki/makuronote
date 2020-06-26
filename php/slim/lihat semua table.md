# lihat semua table

```php
 public function lihatSemuaTable($req,$res){
    $dbName = $this->con->dbName;
    $query = $this->con->db->connect()->fetchRowMany(
        "select table_name from information_schema.tables where table_schema = '$dbName' "
    );
    return $res->withJson(
        is_null($query)?
        ['res'=>false]:['res'=>true,'data'=>$query]
    );
}
```

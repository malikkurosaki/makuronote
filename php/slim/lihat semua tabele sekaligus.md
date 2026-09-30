<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [lihat semua table sekaligus](#lihat-semua-table-sekaligus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# lihat semua table sekaligus

```php
<?php
namespace Malik;
use Psr\Container\ContainerInterface;

class LihatTableController{
    protected $con;

    public function __construct(ContainerInterface $con){
        $this->con = $con;
    }

    public function lihatTable($req,$res,$args){
        $adaParam = isset($args['param']);
        $tabelNya = $adaParam?$args['param']:'xxxx';
        $adaTable = $adaParam?$this->con->db->connect()->fetchRowMany("select * from information_schema.tables where table_schema = '".$this->con->dbName."' and table_name = '".$tabelNya."'"):null;
        $query = is_null($adaTable)?null:$this->con->db->connect()->fetchRowMany("select * from ".$tabelNya);
        return $res->withJson(
            is_null($query)?
            ['res'=>false]:['res'=>true,'data'=>$query]
        );
      
    }
}
```

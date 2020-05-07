# slim php

`composer require slim/slim:3.*`


_/vendor/db.php_
```php
<?php
/**
 * Connect MySQL with PDO class
 */
class db {
  
  private $dbhost = 'localhost';
  private $dbuser = 'root';
  private $dbpass = 'makuro123';
  private $dbname = 'savana';

  public function connect() {
    // https://www.php.net/manual/en/pdo.connections.php
    $prepare_conn_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
    $dbConn = new PDO( $prepare_conn_str, $this->dbuser, $this->dbpass );

    // https://www.php.net/manual/en/pdo.setattribute.php
    $dbConn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // return the database connection back
    return $dbConn;
  }
}
```

_index.php_
```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require 'vendor/db.php';

$app = new \Slim\App;

$app->get('/', function (Request $request, Response $response, array $args) {
   
    $sql = "SELECT * FROM gudang";
 
    try {
      // Get DB Object
      $db = new db();
  
      // connect to DB
      $db = $db->connect();
  
      // query
      $stmt = $db->query( $sql );
      $arts = $stmt->fetchAll( PDO::FETCH_OBJ );
      $db = null; // clear db object
  
      // print out the result as json format
      echo json_encode( $arts );    
        
    } catch( PDOException $e ) {
      // show error message as Json format
      echo '{"error": {"msg": ' . $e->getMessage() . '}';
    }
});
$app->run();

```


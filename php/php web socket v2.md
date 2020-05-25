# php web socket v2

```js
{
    "autoload": {
        "psr-4": {
            "MyApp\\": "src"
        }
    },
    "require": {
        "cboden/ratchet": "^0.4"
    }
}
```

_index.php_

```php
<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MyApp\Chat;

require './vendor/autoload.php';

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    $port = 8080
);

$rn = "server runing on port : $port";
printf($rn);
  
$server->run();
```

_index.html_

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>

    <div id="cek">connecting ....</div>
    <div id="lihat"></div>
    <br>
    <input type="text" id="isi">
    <br>
    <button id="kirim">kirim</button>


    <script>

        var conn = new WebSocket('ws://localhost:8080');
        var datanya = ""
        conn.onopen = function(e) {
           $('#cek').html('connected')
        };

        conn.onmessage = function(e) {
            console.log(e.data);
            datanya += e.data+'<br>'
            $('#lihat').html(datanya)
        };

        $('#kirim').click(()=>{
            datanya += $('#isi').val()+'<br>'
            $('#lihat').html(datanya)
            conn.send($('#isi').val())
            $('#isi').val("")
        })
    </script>
    
</body>
</html>
```

_src/Chat.php_

```php
<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
        
        //$from->send($msg);
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
```

# simple websocket php

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
use Ratchet\Http\OriginCheck;
use MyApp\Chat;

    require './vendor/autoload.php';

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Chat()
            )
        ),
        8080
    );

    $server->run();
```

_bin/Chat.php_

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
        // $numRecv = count($this->clients) - 1;
        // echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
        //     , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
        
        // foreach ($this->clients as $client) {
        //     if ($from !== $client) {
        //         // The sender is not the receiver, send to each client connected
        //         $client->send($msg);
        //     }else{
        //         $client->send('ada apa ya');
        //     }
        // }
        $from->send($msg);
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

_index.html_

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>Document</title>
</head>
<body>

    <div id="lihat"> </div>
    <button id="kirim">kirim</button>

    <script>
        var lihat = document.getElementById('lihat')

        var conn = new WebSocket('ws://192.168.43.57:8080');
        conn.onopen = function(e) {
            lihat.innerHTML = "konected"
        };

        conn.onmessage = function(e) {
            console.log(e.data);
            //console.log('ini on message')
        };


        conn.onclose = function(event) {
            if (event.wasClean) {
                console.log('sonnection close')
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.log('connection die')
            }
        };

        conn.onerror = function(error) {
            console.log('connection error')
        };

        $('#kirim').click(()=>{
            
            conn.send('dimana')
        })

        

        
       
    </script>
    
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.socket.io/4.4.0/socket.io.min.js" integrity="sha384-1fOn6VtTq3PWwfsOrk45LnYcGosJwzMHv+Xh/Jx5303FVOXzEnw0EpLv30mtjmlj" crossorigin="anonymous"></script>
</head>
<body>

    <script>
        var socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });


    </script>
    
</body>
</html>
```


```js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
    credentials: true,
    origin: true
}));

const { Server} = require("socket.io", {
    //allowEIO3: true,
    cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"]
    },
});
const io = new Server(server);
const expressAsyncHandler = require('express-async-handler');

class Svr{
    static io = io;
    static run (socketData){
        app.get('/', expressAsyncHandler( async (req, res) => {
            res.sendFile(__dirname + '/index.html');
        }));

        io.on("connection", (socket) => {
            console.log("socket connected");

            socket.on('fb', (data) => {
                socketData(data);
            });
        });
        
        server.listen(3000, () => {
            console.log('listening on *:3000');
        });
        
    }
}

module.exports = {Svr}
```

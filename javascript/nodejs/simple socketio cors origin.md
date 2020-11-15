# simple socket io 

```js
const server = require('http').createServer();
const io = require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  }
);

io.on('connection', socket => {
    socket.on('chat',(data) => {
        io.emit('chat',data)
        console.log(data)
    })
})

server.listen(3000);
```

client

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.min.js"></script>
</head>
<body>

    <script>
        const sok = io('http://localhost:3000')
        sok.emit('chat','ini dimana gaes')
        sok.on('chat', data => {
            console.log(data)
        })
    </script>
    
</body>
</html>
```

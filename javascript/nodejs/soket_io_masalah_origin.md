```js

const ios = require('socket.io');
const io = new ios.Server({
    allowEIO3: true,
    cors: {
        origin: true,
        credentials: true
    },
});

io.on('connection', socket => {
    socket.on('chat',(data) => {
        io.emit('chat',data)
        console.log(data)
    })
})

io.listen(3000, () => {
    console.log('[socket.io] listening on port 3000')
});

console.log('ini dimanan')
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>
<body>
    <button id="tekan">tekan aja</button>
    <script>
        console.log("mulai")

        const socket = io("http://139.180.217.11:3000");
        socket.on('chat',(data) => {
            console.log(data)
        });
        
        $('#tekan').click(function (e) { 
            socket.emit('chat',"hai apa kabar chat ii")
        });

    </script>
    
</body>
</html>
```

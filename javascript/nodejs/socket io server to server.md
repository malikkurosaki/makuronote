# server to server

### client

```js
const io = require("socket.io-client");

const socket = io("ws://localhost:6000", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123"
  },
  query: {
    "my-key": "my-value"
  }
});

socket.on('chat', msg => {
    console.log(msg);
});

socket.on('connect', () => {
    console.log(socket.auth.token);
});

socket.emit('chat', 'yayaya');

```

### server
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
});


io.listen(6000, () => {
    console.log('[socket.io] listening on port 3000')
});
```

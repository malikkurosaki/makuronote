# socket

```js
const ios = require('socket.io');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const j = require('socketio-jwt');

const io = new ios.Server({
    //allowEIO3: true,
    path: '/apa',
    cors: {
        origin: true,
        credentials: true
    },
});

io.use((socket, next) => {
    if(socket.handshake.auth && socket.handshake.auth.token){
        jwt.verify(socket.handshake.auth.token, process.env.TOKEN, (err, user) => {
            if(err){
                const e = new Error('not authorized');
                e.data = {content: 'coba lagi'};
                next(e);
            };
            socket.user = user;
            next();
        });

    }else{
        next(new Error('auth gagal'));
    }
}).on('connect_error', err => {
    console.log(err);
});

io.on('connection', socket => {
    socket.on('chat',(data) => {
        io.emit('chat',data)
        console.log(data)
    });

    //console.log(socket);
});

io.of('/apa').on('connection', socket => {
    console.log('ini apa');
});

// io.on('connect_error', error => {
//     console.log(error);
// });

// io.on('connect_failed', err => {
//     console.log('connetion filed');
// });


io.listen(6000, () => {
    console.log('[socket.io] listening on port 3000')
});




// console.log(jwt.sign({user: "siapa"}, process.env.TOKEN, {expiresIn: 60*60}));

// jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1hIjoic2lhcGEiLCJpYXQiOjE2Mjk0MDY4ODYsImV4cCI6MTYyOTQwODY4Nn0.C32mERvD3fcSW5f0K_N4i6i5uaKxXQQljgSxn-BO1Q0', process.env.TOKEN.toString(), (err, nama) =>{
//     console.log(nama);
// });





```

### client

```js

const io = require("socket.io-client");

const socket = io("ws://localhost:6000", {
    // transports: ["websocket", "polling"],
    // rejectUnauthorized:   false,
//   reconnectionDelayMax: 10000,
    path: '/apa',
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic2lhcGEiLCJpYXQiOjE2Mjk0MTA3NjcsImV4cCI6MTYyOTQxNDM2N30.CqA8pcy4xxmG-BQbRdvoOCcuaoBQcFoqc2E3_wKiYQc"
    }
});


socket.on("connect_error", (err) => {
    console.log("connect_error", err.message);
});

socket.io.on('error', err => {
    console.log("error", err.message);
});

socket.io.on("reconnect", (attempt) => {
    console.log( "reconnect", attempt);
});

socket.io.on("reconnect_attempt", (attempt) => {
   console.log('reconnect_attempt', attempt);
});

socket.io.on("reconnect_error", (error) => {
   console.log('reconnect_error', error);
});

socket.io.on("reconnect_failed", () => {
   console.log('reconnect_failed');
});

socket.on('chat', msg => {
    console.log(msg);
});

socket.io.on("ping", () => {
   console.log('ping');
});

socket.on("disconnect", (reason) => {
    console.log('diconnect', reason);
    if (reason === "io server disconnect") {
      
      socket.connect();
    }
    // else the socket will automatically try to reconnect
});

socket.on('connect', () => {
    //console.log(socket.auth.token);
});

socket.emit('chat', 'yayaya');

```

# socket io di flutter dan node js

```javascript
var socket = require('socket.io');

// mulai serever
var server = app.listen(PORT, () => {
    console.log(`app run on port : ${PORT}`)
})

// deklarasi soket io
var io = socket(server);

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on("chat",(msg)=>{
        console.log(msg)
        io.emit("chat",msg)
    })
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    io.emit("chat","ini dia")
});

```


```dart
void soketIo()async{
    SocketIOManager manager = SocketIOManager();
    SocketIO socket = await manager.createInstance(SocketOptions('http://192.168.192.188:8080',nameSpace: '/', enableLogging: true, transports: [Transports.POLLING]));
    socket.onConnect((data){
      print("connected...");
      print(data);
      socket.emit("chat", ["Hello world!"]);
    });
    socket.on("chat", (data){   //sample event
      print("chat");
      print(data);
    });
    socket.connect();
  }
  ```
  
  
  ```yaml
    adhara_socket_io:
  ```

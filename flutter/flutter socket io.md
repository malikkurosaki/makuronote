### main.dart
```dart
import 'package:flutter/material.dart';
import 'package:get/get_state_manager/get_state_manager.dart';
import 'package:get/instance_manager.dart';
import 'package:get/route_manager.dart';
import 'package:get_storage/get_storage.dart';
import 'package:makuro/controllers/storage.dart';
import 'package:makuro/views/auth.dart';
import 'package:makuro/views/my_home.dart';
import 'package:makuro/views/root_view.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

void main() async{

  IO.Socket socket = IO.io('http://localhost:3000/',
    IO.OptionBuilder()
    .setTransports(["polling", "websocket"])
    .build()
  );

    socket.onConnect((sck) {
     print("$sck ada ini");
     socket.emit('msg', 'test');
    });
    socket.on('msg', (data) => print(data));
    socket.onDisconnect((_) => print('disconnect'));
    socket.on('fromServer', (_) => print(_));

  await GetStorage.init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(Object context) => 
  Center(
    child: Container(
      constraints: BoxConstraints(
        maxWidth: 500,
        minWidth: 200
      ),
      child: Card(
        elevation: 0,
        child: GetMaterialApp(
          debugShowCheckedModeBanner: false,
          initialRoute: '/',
          initialBinding: MyBinding(),
          getPages: [
            GetPage(name: "/", page: () => RootView()),
            GetPage(name: '/home', page: () => MyHome()),
            GetPage(name: "/login", page: () => Login()),
            GetPage(name: '/signup', page: () => Signup())
          ],
        ),
      ),
    ),
  );

}

class MyBinding extends Bindings{
  @override
  void dependencies() {
    Get.put(MyCtrl());
  }

}

class MyCtrl extends GetxController{}
```

### nodejs
```js
const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
app.use(cors());
const io = require('socket.io')(server,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    }
);

io.on("connection", (socket) => 
    {
        console.log("ada koneksi")
        socket.on("msg", (data) => 
            {
                console.log(data);
                socket.emit("msg", data);
            }
        );
    }
    

);


app.get("/", (a, b) => b.send("apa kabar"))

server.listen(3000);

```

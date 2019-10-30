# membuat custom widget flutter

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:toast/toast.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      title: "apa kabarnyua",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.red,
        fontFamily: 'Liu'
      ),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Contoh(),
          ),
        ),
      ),
    );
  }
}

class Contoh extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.topCenter,
      width: double.infinity,
      color: Colors.cyan,
      padding: EdgeInsets.all(16),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            color: Colors.red,
            padding: EdgeInsets.all(8),
            child: Text("ini satu"),
          ),
          Container(
            color: Colors.yellow,
            child: Text("ini adalah dua"),
            padding: EdgeInsets.all(8),
          ),
          Container(
            color: Colors.blue,
            child: new Bantuan().textNya,
            padding: EdgeInsets.all(8),
          ),
          _widgetNama(10)
        ],
      ),
    );
  }
}

class Bantuan{
  final textNya = Text("apa kabarnya");
}

Widget _widgetNama(int apa)=> Expanded(
  child: Container(
    color: Colors.deepOrange,
    padding: EdgeInsets.all(16),
    child: Text("ini dia kabarnya"),
  ),
);
```

# flutter match parent lebar


```dart
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
        primarySwatch: Colors.red
      ),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Gambar(),
          ),
        ),
      ),
    );
  }
}

class Gambar extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _GambarState();
  }
}

class _GambarState extends State<Gambar> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return ListView(
      children: <Widget>[
        Container(
          width: double.infinity,
          color: Colors.red,
          padding: EdgeInsets.all(8),
          child: Text("contoh container match parent lebar",style: TextStyle(color: Colors.white,fontSize: 24),),
        )
      ],
    );
  }
}

```

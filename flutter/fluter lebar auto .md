# flutter lebar auto

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
      padding: EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          Expanded(
            child: Container(
              color: Colors.red,
              child: Text("ini adalah satu"),
              padding: EdgeInsets.all(16),
            ),
          ),
          Expanded(
            child: Container(
              color: Colors.blue,
              child: Text("ini adalah dua"),
              padding: EdgeInsets.all(16),
            ),
          ),
          Expanded(
            child: Container(
              child: Text("ini adalah tiga"),
              color: Colors.red,
              padding: EdgeInsets.all(16),
            ),
          )
        ],
      ),
    );
  }
}

```

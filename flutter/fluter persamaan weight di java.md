<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter persamaan weig layout di java](#flutter-persamaan-weig-layout-di-java)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter persamaan weig layout di java

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
          Container(
            color: Colors.red,
            padding: EdgeInsets.all(16),
            child: Text("ini adalah satu"),
          ),
          Container(
            color: Colors.yellow,
            padding: EdgeInsets.all(16),
            child: Text("ini adalah dua"),
          ),
          Container(
            color: Colors.blue,
            padding: EdgeInsets.all(16),
            child: Text("ini adalah tiga"),
          )
        ],
      ),
    );
  }
}

```

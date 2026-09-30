<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [membuat custom text](#membuat-custom-text)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# membuat custom text 

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
          )
        ],
      ),
    );
  }
}

class Bantuan{
  final textNya = Text("apa kabarnya");
}
```

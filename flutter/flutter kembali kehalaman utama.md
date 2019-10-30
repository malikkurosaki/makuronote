# layout kembali kehalaman utama

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
      ),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Halaman1(),
          ),
        ),
      ),
    );
  }
}

class Halaman1 extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(
        title: Text("ini adalah halaman satu"),
      ),
      body: Center(
        child: RaisedButton(
          child: Text("ke halaman 2"),
          onPressed: (){
              Navigator.push(context, MaterialPageRoute(builder: (context)=>Hallaman2()));
          },
        ),
      ),
    );
  }

}


class Hallaman2 extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(
        title: Text("ini halaman dua"),
      ),
      body: Center(
        child: RaisedButton(
          child: Text("menuju halaman satu"),
          onPressed: (){
            Navigator.pop(context);
          },
        ),
      ),
    );
  }

}


```

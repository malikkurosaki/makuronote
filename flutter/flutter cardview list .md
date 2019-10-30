# flutter cardview list

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
      width: double.infinity,
      padding: EdgeInsets.all(8),
      child: _buildCard(),
    );
  }
}



Widget _buildCard() => SizedBox(
  height: 210,
  child: Card(
    child: Column(
      children: <Widget>[
        ListTile(
          title: Text("INI judulnya",style: TextStyle(fontWeight: FontWeight.w500),),
          subtitle: Text("ini subtitlenya"),
          leading: Icon(
            Icons.restore_page,
            color: Colors.blue,
          ),

        ),
        Divider(),
        ListTile(
          title: Text("ini judulnya",style: TextStyle(fontWeight: FontWeight.w500),),
          leading: Icon(
            Icons.accessibility,
            color: Colors.blue,
          ),
        )
      ],
    ),
  ),
);


```

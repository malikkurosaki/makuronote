# membuat snackbar

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
            child: Kotak(),
          ),
        ),
      ),
    );
  }
}

class Kotak extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _KotakState();
  }

}

class _KotakState extends State<Kotak> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      padding: EdgeInsets.all(16),
      color: Colors.amber,
      child: RaisedButton(
        onPressed: (){
          Scaffold.of(context).showSnackBar(SnackBar(content: Text("gak uncul"),));
        },
        child: Text("tekan sini aja gan"),
      ),
    );
  }
}

```

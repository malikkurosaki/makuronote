# flutetr memnunculkan gambar

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
    return Container(
      child: Image.asset("ssets/png_splash.png"),
    );
  }
}

```


### setingan pada pubspec.yaml

```yaml
name: project_sau
description: A new Flutter application.
version: 1.0.0+1

environment:
  sdk: ">=2.1.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2
  toast: ^0.1.5


dev_dependencies:
  flutter_test:
    sdk: flutter


flutter:
  uses-material-design: true
  assets:
    - assets/png_splash.png

```

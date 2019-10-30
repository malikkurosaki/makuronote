# flutter splashscreen v3

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:splashscreen/splashscreen.dart';
import 'package:toast/toast.dart';
import 'dart:async';

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
            child: new SplashScreen(
              seconds: 4,
              navigateAfterSeconds: new AfterSplash(),
              title: Text("selamat datang di splash"),
              image: Image.asset("assets/png_splash.png"),
              backgroundColor: Colors.blue,
              styleTextUnderTheLoader: new TextStyle(),
              photoSize: 100.0,
              loaderColor: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}

class AfterSplash extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return new AfrterState ();
  }
}

class AfrterState extends State<AfterSplash> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Center(
        child: Text("apa kabarnya ini ya"),
      ),
    );
  }
}



```


### tambah dependencynya

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2
  toast: ^0.1.5
  splashscreen:

```

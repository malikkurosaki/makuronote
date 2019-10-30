# memebuat splashscreen

```dart

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
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
            child: SplashScreen(),
          ),
        ),
      ),
      routes: <String,WidgetBuilder>{
        '/HomeScreen':(BuildContext context)=>new HomeScreen()
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return new _SplashState();
  }
}

class _SplashState extends State<SplashScreen> {

  startTime() async{
    var _duration = new Duration(seconds: 2);
    return new Timer(_duration,navigationpage);
  }


  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Center(
        child: new Image.asset("assets/png_splash.png"),
      ),
    );
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    startTime();
  }

  void navigationpage() {
    Navigator.of(context).pushReplacementNamed("/HomeScreen");
  }
}

class HomeScreen extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _HomeSatate();
  }

}

class _HomeSatate extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Center(
        child:  Text("apa kabarnya "),
      ),
    );
  }
}


```

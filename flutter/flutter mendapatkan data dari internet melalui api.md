# flutter mendapatkan api ada internet

```dart 
import 'dart:async';
import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:probus_presto/LayoutBottomNav.dart';
import 'package:probus_presto/LayoutRoute.dart';
import 'package:http/http.dart' as http;

import 'Post.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.red
      ),
      home: SplashScren(),
    );
  }
}

class SplashScren extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _SplashScren();
  }
}

class _SplashScren extends State<SplashScren> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    Timer(Duration(seconds: 4),()=>Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (BuildContext context)=> new LayoutMain())));
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Container(
        color: Colors.red,
        child: Center(
          child: Text("ini adalah splash screenn 20"),
        ),
      ),
    );
  }
}

class LayoutMain extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _LayoutMain();
  }

}

class _LayoutMain extends State<LayoutMain> {
  Future<Post> post;
  var tuliasan = " kosong gaan";


  @override
  void initState() {

    super.initState();
    post = fetchPost();

    tuliasan = "barusana dari state";
  }

  @override
  Widget build(BuildContext context) {

    var datanya = FutureBuilder<Post>(
      future: post,
      builder: (context,snapshot){
        if (snapshot.hasData) {
          return Text(snapshot.data.title+" ini datanya");
        }else if (snapshot.hasError) {
          return Text(snapshot.error);
        }
        return CircularProgressIndicator();
      },
    );

    return Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: SafeArea(
          child: datanya,
        ),
      ),
    );
  }
}

Future<Post> fetchPost() async{
  final response = await http.get('https://jsonplaceholder.typicode.com/posts/1');
  if (response.statusCode == 200) {
    return Post.fromJson(jsonDecode(response.body));
  }  else{
    throw Exception ("filed to get data");
  }
}


```


### dependencynya

```yaml

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2
  http:
  
  ```

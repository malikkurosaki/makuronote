# membuat listview builder didalam column layout

```dart 
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:presto_online/helper/ApiInterface.dart';
import 'package:presto_online/helper/HelperPojo.dart';
import 'package:presto_online/helper/SplashScreen.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Column(
              children: <Widget>[
                Expanded(
                  flex: 0,
                  child: Text("apa kabarnya ya"),
                ),
                Expanded(
                  flex: 1,
                  child: lisBuilder(),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Widget lisBuilder(){
  return ListView.builder(
      itemCount: List<String>.generate(10,(i)=>"apa $i").length,
      itemBuilder: (BuildContext context, int index){
        return Text("apa kabar");
      }
  );
}

```

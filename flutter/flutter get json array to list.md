# flutter get json array to list

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "presto online",
      theme: ThemeData(
        primarySwatch: Colors.amber
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text("Presto Online",style: TextStyle(color: Colors.white),),
        ),
        drawer: Drawer(
          child: ListView(
            children: <Widget>[
              DrawerHeader(
                child: Text("Probus Presto"),
                decoration: BoxDecoration(
                  color: Colors.amber
                ),
              ),
              ListTile(
                title: Text("menu1"),
                onTap: (){

                },
              ),
              ListTile(
                title: Text("menu 2"),
                onTap: (){

                },
              )
            ],
          ),
        ),
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child:Contoh(),
          ),
        ),
      ),
    );
  }
}

class Contoh extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _Contoh();
  }

}

class _Contoh extends State<Contoh> {

  Future<List<HelperJson>> theData;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    theData = mendapatkanPost(http.Client());

  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return FutureBuilder<List<HelperJson>>(
      future: theData,
      builder: (context,snapshot){
        if (snapshot.hasData) {
          return GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2
              ),
              itemCount: snapshot.data.length,
              itemBuilder: (context,index){
                return Container(
                  margin: EdgeInsets.all(4),
                  padding: EdgeInsets.all(8),
                  color: Colors.deepPurpleAccent,
                  child: Center(
                    child: Text(snapshot.data[index].kdAgen,style: TextStyle(color: Colors.white),),
                  ),
                );
              }
          );
        }
        return Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }
}

// mendapatkan data

List<HelperJson> bantuan(String response){
  final parsed = json.decode(response).cast<Map<String,dynamic>>();
  return parsed.map<HelperJson>((json)=>HelperJson.fromJson(json)).toList();
}

Future<List<HelperJson>> mendapatkanPost(http.Client client) async{
  final response = await client.get('https://purimas.probussystem.com:4450/api/roomProduction');
  return bantuan(response.body);
}


class HelperJson {
    String kdAgen;
    String nmAgen;
    int value;

    HelperJson({this.kdAgen, this.nmAgen, this.value});

    factory HelperJson.fromJson(Map<String, dynamic> json) {
        return HelperJson(
            kdAgen: json['kd_agen'],
            nmAgen: json['nm_agen'],
            value: json['value'],
        );
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> data = new Map<String, dynamic>();
        data['kd_agen'] = this.kdAgen;
        data['nm_agen'] = this.nmAgen;
        data['value'] = this.value;
        return data;
    }
}

```

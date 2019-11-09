 # flutter membuat dropdown menu yag benar dari interneet
 
```dart

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
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
        body: Baru(),
      ),
    );
  }
}

class Baru extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _Baru();
  }

}

class _Baru extends State<Baru> {

  Future<List<NamaOutlet>> lsNama;
  List<NamaOutlet> namaList;
  NamaOutlet namanama;
  String nm = "pilih outlet";
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    lsNama = getData();

  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return FutureBuilder(
      future: lsNama,
      builder: (context,snapshot){
        if (snapshot.connectionState == ConnectionState.done) {
          List<NamaOutlet> data = snapshot.data;

          return DropdownButton(
            hint: Text(nm),
            value: namanama,
            items: List<int>.generate(data.length, (index)=>(index)).map((index)=>DropdownMenuItem<NamaOutlet>(
              child: Text(data[index].nama_out),
              value: data[index],
            )).toList(),
            onChanged: (NamaOutlet value) {
                setState(() {
                  nm = value.nama_out;
                  namanama = value;
                });
            },

          );
        }else{
          return CircularProgressIndicator();
        }

      },
    );
  }
}

Future<List<NamaOutlet>> getData() async{
  var response = await http.get("https://purimas.probussystem.com:4450/api/getOutlets");
  if (response.statusCode == 200) {
    final itemNya = json.decode(response.body).cast<Map<String,dynamic>>();
    List<NamaOutlet> theNama = itemNya.map<NamaOutlet>((json){
      return NamaOutlet.fromJson(json);
    }).toList();
    return theNama;
  }else{
    throw Exception("error mendapatkan list outlet");
  }
}

```

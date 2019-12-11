# provider future dan change listener

### main

```dart
void main()=>runApp(MultiProvider(
  providers: [
      ChangeNotifierProvider(create: (_)=>BlocGetOutlet(),)
  ],
  child: MaterialApp(
    home: MyHome(),
  ),
));

class MyHome extends StatelessWidget {

  @override
  build(BuildContext context){
    var _listOutlet = Provider.of<BlocGetOutlet>(context);

    Widget _outlet(){
      return DropdownButton(
        items: _listOutlet.lsOutlet.map((data)=>DropdownMenuItem<PojoGetOutlet>(
          value: data,
          child: Text(data.nama_out),
        )).toList(),
        onChanged: (PojoGetOutlet ot){
            _listOutlet.hint = ot.nama_out;
        },
        hint: Text(_listOutlet.hint??"select outlet"),
      );
    }

    return Scaffold(body: Container(
      child: Container(
        child: Column(
          children: <Widget>[
            _listOutlet.lsOutlet == null?Text("loading"):_outlet(),
            Text("datda"),

          ],
        ),
      ),
    ),);
  }
}


```

### bloc

```dart

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:presto_mobile/helper/bantuan.dart';
import 'package:presto_mobile/helper/pojo.dart';

class BlocGetOutlet  with ChangeNotifier{
  List<PojoGetOutlet> _lsOutlet;
  String _hint = "select outlet";
  String _theOutlet = "all";

  BlocGetOutlet(){
    getDataOutlet();
  }

  List<PojoGetOutlet> get lsOutlet => _lsOutlet;

  set lsOutlet(List<PojoGetOutlet> value) {
    _lsOutlet = value;
    notifyListeners();
  }


  String get hint => _hint;

  set hint(String value) {
    _hint = value;
    notifyListeners();
  }

  Future<List<PojoGetOutlet>> getDataOutlet()async{
    var res = await http.get(TheUrl.getOutlet);
    if(res.statusCode == 200){
      final itm = json.decode(res.body).cast<Map<String,dynamic>>();
      List<PojoGetOutlet> lsData = itm.map<PojoGetOutlet>((json)=>PojoGetOutlet.fromJson(json)).toList();

      lsOutlet = lsData;
      notifyListeners();
      return lsData;
    }
  }


}


```

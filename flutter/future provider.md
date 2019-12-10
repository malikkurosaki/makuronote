# contoh future provider

```dart

// main

void main() => runApp(
    MultiProvider(
        providers: [
          FutureProvider(
            create: (_)=>OutletProvider().getListDataOutlet(),
          )
        ],
      child: MaterialApp(
        home: Scaffold(
          body: Container(
            child: SafeArea(
              child: Container(
                child: ProDua(),
              ),
            ),
          ),
        ),
      ),
    )
);


class ProDua extends StatelessWidget{

  @override
  Widget build(BuildContext context) {


    var _outlet = Provider.of<List<PojoGetOutlet>>(context);
    return Container(
      child:  _outlet == null?Text("loading"):Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: _outlet.map((data)=> Text(data.nama_out),).toList(),
      ),
    );
  }

}



```


### class future provider

```dart


import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:presto_mobile/helper/bantuan.dart';
import 'package:presto_mobile/helper/pojo.dart';
import 'package:http/http.dart' as http;

class OutletProvider extends ChangeNotifier{
  List<PojoGetOutlet> _lsOutlet;

  List<PojoGetOutlet> get lsOutlet => _lsOutlet;

  set lsOutlet(List<PojoGetOutlet> value) {
    _lsOutlet = value;
  }

  Future<List<PojoGetOutlet>> getListDataOutlet() async{
    var res = await http.get(TheUrl.getOutlet);
    if(res.statusCode == 200){
      final item = json.decode(res.body).cast<Map<String,dynamic>>();
      List<PojoGetOutlet> lsData = item.map<PojoGetOutlet>((json)=>PojoGetOutlet.fromJson(json)).toList();
      lsOutlet = lsData;
      return lsData;
    }else{
      print("error get data outlet");
      return null;
    }
  }

}

```

# flutter callback value flutter 

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:presto_mobile/helper/HelperApi.dart';
import 'package:presto_mobile/helper/pojohelper.dart';

class MenuNamaOutlet extends StatefulWidget{

  final Function(String nama) onNama;

  const MenuNamaOutlet({Key key, this.onNama}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _MenuNamaOutlet();
  }

}

class _MenuNamaOutlet extends State<MenuNamaOutlet> {

  Future<List<PojoGetOutlet>> fListOutlet;
  List<PojoGetOutlet> listNamaOutlet;
  PojoGetOutlet pojoNamaOutlet;
  String _namaOutlet = "pilih outlet";

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fListOutlet = getOutlet();
  }

  @override
  Widget build(BuildContext context) {

    return FutureBuilder(
      future: fListOutlet,
      builder: (context,snapshot){
        if (snapshot.connectionState == ConnectionState.done) {
          listNamaOutlet = snapshot.data;
          return DropdownButton(
            value: pojoNamaOutlet,
            hint: Text(_namaOutlet),
            items: List<int>.generate(listNamaOutlet.length, (index)=>(index)).map((index)=>DropdownMenuItem<PojoGetOutlet>(
              child: Text(listNamaOutlet[index].nama_out),
              value: listNamaOutlet[index],
            )).toList(),
            onChanged: (PojoGetOutlet value) {
               setState(() {
                 pojoNamaOutlet = value;
                 _namaOutlet = value.nama_out;
                 widget.onNama(_namaOutlet);
               });
            },
          );
        }  else{
          return Text("loading ...");
        }
      },
    );
  }
}


```


### inplementasinya

```dart
import 'package:flutter/material.dart';
import 'package:presto_mobile/helper/element.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "presto mobile",
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Column(
              children: <Widget>[
                Expanded(
                  flex: 0,
                  child: MenuNamaOutlet(
                    onNama: (String nama){
                      print(nama);
                    },
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

}

```

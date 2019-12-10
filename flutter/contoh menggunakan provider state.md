# contoh menggunakan provider state 


### main

```dart

void main() => runApp(
    MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_)=>ContohProvider(),
          ),
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

    var _kunci = TextEditingController();
    var _outlet = Provider.of<List<PojoGetOutlet>>(context);
    var _mendata = Provider.of<ContohProvider>(context);
    return Container(
      child:  _outlet == null?Text("loading"):Container(
        child: Column(
          children: <Widget>[
            Container(
              margin: EdgeInsets.all(8),
              child: TextField(
                decoration: InputDecoration(
                  fillColor: Colors.black12,
                  filled: true
                ),
                controller: _kunci,
              ),
            ),
            Container(
              child: RaisedButton(
                child: Text(_mendata.datanya??"tekan"),
                onPressed: (){
                  _mendata.updateData(_kunci.text.isEmpty?"tekan":_kunci.text);
                },
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: _outlet.map((data)=> Text(data.nama_out),).toList(),
            ),
          ],
        ),
      )
    );
  }

}
```

### bloc provider

```dart


import 'package:flutter/cupertino.dart';

class ContohProvider extends ChangeNotifier{
  String _datanya;

  String get datanya => _datanya;

  set datanya(String value) {
    _datanya = value;
    notifyListeners();
  }

  updateData(String data){
    datanya = data;
  }
}

```

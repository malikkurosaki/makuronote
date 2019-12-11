# contoh state dental provider dan value builder

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
    _listOutlet.getDataAnalisticByDay(_listOutlet.hint);
    _listOutlet.getDataOutlet();


    ValueNotifier<String> _val = ValueNotifier<String>("apa");
    Widget _outlet(){
      return DropdownButton(
        items: _listOutlet.lsOutlet.map((data)=>DropdownMenuItem<PojoGetOutlet>(
          value: data,
          child: Text(data.nama_out),
        )).toList(),
        onChanged: (PojoGetOutlet ot){
            _listOutlet.hint = ot.kode_out;
           _listOutlet.dataVal.value = ot.nama_out;
        },
        hint: Text(_listOutlet.hint??"select outlet"),
      );
    }

    return Scaffold(body: Container(
      child: Container(
        child: ListView(
          children: <Widget>[
            Container(child: Text("apa kabar"),),
            Container(
              height: 1000,
              width: double.infinity,
            ),
            _listOutlet.lsOutlet == null?Text("loading.."):_outlet(),
            ValueListenableBuilder(
              valueListenable: _listOutlet.dataVal,
              builder: (a,b,c){
                return Text(b);
              },
            ),
            RaisedButton(
              child: Text("tekan"),
              onPressed: (){
                _listOutlet.dataVal.value = "hahahahah";
                _listOutlet.getDataOutlet();
                Navigator.of(context).push(PageRouteBuilder(pageBuilder: (a,b,c)=>Kedua()));
              },
            )
          ],
        ),
      ),
    ),);
  }
}

class Kedua extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Scaffold(
        body: Container(
          child: SafeArea(
            child: Container(
              child: RaisedButton(
                child: Text("balik"),
                onPressed: (){
                  Navigator.pop(context);
                },
              ),
            ),
          ),
        ),
      ),
    );
  }

}
```

### bloc

```dart
class BlocGetOutlet with ChangeNotifier{
  List<PojoGetOutlet> _lsOutlet;
  String _hint = "all";
  String _theOutlet = "all";

  ValueNotifier<String> _dataVal = ValueNotifier<String>("");


  ValueNotifier<String> get dataVal => _dataVal;

  set dataVal(ValueNotifier<String> value) {
    _dataVal = value;
    notifyListeners();
  }

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

  List<PojoTopTenProductFood> _lsAnalisticByDay;


  List<PojoTopTenProductFood> get lsAnalisticByDay => _lsAnalisticByDay;

  set lsAnalisticByDay(List<PojoTopTenProductFood> value) {
    _lsAnalisticByDay = value;
    notifyListeners();
  }

  Future<List<PojoTopTenProductFood>> getDataAnalisticByDay(String outlet)async{
    var res = await http.get(TheUrl.getUrlTopTenSalesByProductFood(outlet, "2019-12-11", "all", "MTD"));
    if(res.statusCode == 200){
      var item = json.decode(res.body).cast<Map<String,dynamic>>();
      List<PojoTopTenProductFood> listData = item.map<PojoTopTenProductFood>((json)=>PojoTopTenProductFood.fromJson(json)).toList();

      lsAnalisticByDay = listData;
      notifyListeners();
      return listData;


    }
  }


}


class CobaData extends ValueNotifier<List<PojoGetOutlet>>{
  CobaData(List<PojoGetOutlet> value) : super(value);

  void gantiDataku(List<PojoGetOutlet> data){
    value = data;
    notifyListeners();
  }
}

```

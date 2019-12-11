# flutter value listenable builder 

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
    ValueNotifier<String> _val = ValueNotifier<String>("apa");
    Widget _outlet(){
      return DropdownButton(
        items: _listOutlet.lsOutlet.map((data)=>DropdownMenuItem<PojoGetOutlet>(
          value: data,
          child: Text(data.nama_out),
        )).toList(),
        onChanged: (PojoGetOutlet ot){
            _listOutlet.hint = ot.kode_out;
            _val.value = ot.kode_out;
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
            _listOutlet.lsOutlet == null?Text("loading"):_outlet(),
            ValueListenableBuilder(
              valueListenable: _val,
              builder: (a,b,c){
                _val.value  = "iin";
                return Text(b);
              },
            ),
            RaisedButton(
              child: Text("tekan"),
              onPressed: (){
                _val.value = "yayayayaya";
              },
            )
          ],
        ),
      ),
    ),);
  }
}

```

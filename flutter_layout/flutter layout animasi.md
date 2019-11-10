# flutter layout animasi

> membuat animasi saal tombol ditekan

```dart
lass _MyBody extends State<MyBody> {

  String theCode = "RST";
  Future<List<PojoSalesTrafic>> fList;
  List<PojoSalesTrafic> ls;
  PojoSalesTrafic salesTrafic;

  Color _warna = Colors.amber;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fList = getSallesTrafic(theCode);
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build


    return Column(
      children: <Widget>[
        AnimatedContainer(
          duration: Duration(seconds: 1),
          decoration: BoxDecoration(
            color: _warna
          ),
          child: Container(
            padding: EdgeInsets.all(16),
            child: Text("halo  apa kabar"),
          ),
        ),
        RaisedButton(
          onPressed: (){
            setState(() {
              _warna = Colors.blue;
            });
          },
          child: Text("tekan"),
        )
      ],
    );
    
```

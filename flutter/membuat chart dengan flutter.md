# membuat chart dengan flutter


```dart

class CSalesTrafic extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _CSalesTrafic();
  }

}

class _CSalesTrafic extends State<CSalesTrafic> {

  Future<List<PojoSalesTrafic>> fSTrafic;
  List<PojoSalesTrafic> lSTrafic;
  PojoSalesTrafic pSTrafic;
  String cSTrafic = "RST";
  List<PojoCSalesTrafic> lCSTrafic;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();


  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return FutureBuilder(
      future: getSalesTrafic(cSTrafic),
      builder: (context,snapshot){
        if (snapshot.connectionState == ConnectionState.done) {
          lSTrafic = snapshot.data;
          lCSTrafic = List.generate(lSTrafic.length, (i){
            return new PojoCSalesTrafic(lSTrafic[i].date, int.parse(lSTrafic[i].value), Colors.red);
          }).toList();

          List<charts.Series<PojoCSalesTrafic,String>> series = [
            new charts.Series(
                id: "Click",
                data: lCSTrafic,
                domainFn:(PojoCSalesTrafic str,_)=> str.date,
                measureFn: (PojoCSalesTrafic str,_)=>str.value,
                colorFn: (PojoCSalesTrafic str,_)=>str.color
            )
          ];

          charts.BarChart chart2 = new charts.BarChart(series);

          return Padding(
            padding: EdgeInsets.all(8),
            child: SizedBox(
              child: chart2,
              height: 200,
            ),
          );
        }  else{
          return Text("loading ... ");
        }
      },
    );
  }
}

```



### pojo objecknya

```dart
class PojoCSalesTrafic {
    final date;
    final value;
    final charts.Color color;

  PojoCSalesTrafic(this.date, this.value, Color color): this.color = new charts.Color(
      r: color.red,
      g: color.green,
      b: color.blue,
      a: color.alpha
  );
}

```

### ambil data dari api

```dart
Future<List<PojoSalesTrafic>> getSalesTrafic(String code) async {
  var response = await http.get("https://purimas.probussystem.com:4450/api/salesTrafic/$code");
  if (response.statusCode == 200) {
    final itm = json.decode(response.body).cast<Map<String,dynamic>>();
    List<PojoSalesTrafic> ls = itm.map<PojoSalesTrafic>((json){
      return PojoSalesTrafic.fromJson(json);
    }).toList();
    return ls;
  }else{
    throw Exception("error mendapatkan data sales trafic");
  }
}

```

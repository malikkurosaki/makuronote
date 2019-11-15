# flutter responsive


```dart
class FbHome extends StatefulWidget{

  final String codeNya;

  const FbHome({Key key, this.codeNya}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _FbHome();
  }
  
}

class _FbHome extends State<FbHome> {

  Future<List<PojoFbHome>> fls;
  List<PojoFbHome> ls;
  PojoFbHome pj;
  int berapa = 2;


  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return FutureBuilder(
        future: getFbHome(widget.codeNya),
        builder: (context,snapshot){

          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) return Center(child: Text("terjadi kesalahan koneksi ke server"),);
            ls = snapshot.data;
            return LayoutBuilder(
              builder: (context,strain){
                
                if(strain.maxWidth > 0 && strain.maxWidth < 600){
                  berapa = 2;
                }else if (strain.maxWidth > 600 && strain.maxWidth < 768) {
                  berapa = 3;
                } else if (strain.maxWidth > 768 && strain.maxWidth < 992) {
                  berapa = 4;
                } else if (strain.maxWidth > 992 && strain.maxWidth < 1200) {
                  berapa = 5;
                } else{
                  berapa = 6;
                }
                
                return GridView.count(
                  crossAxisCount: berapa,
                  children: List.generate(ls.length, (index){
                    return Card(
                      child: Container(
                        decoration: BoxDecoration(
                            gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.topRight,
                                colors: [
                                  Colors.primaries[Random().nextInt(Colors.primaries.length)],
                                  Colors.primaries[Random().nextInt(Colors.primaries.length)]
                                ]
                            )
                        ),
                        margin: EdgeInsets.all(2),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: <Widget>[
                            Flexible(
                              fit: FlexFit.tight,
                              flex: 1,
                              child: Text("Rp. ${new FlutterMoneyFormatter(amount: double.parse(ls[index].today.toString())).output.withoutFractionDigits}",style: TextStyle(fontSize: 24,color: Colors.black),),
                            ),
                            Flexible(
                              flex: 1,
                              fit: FlexFit.tight,
                              child: Text("Rp. ${new FlutterMoneyFormatter(amount: double.parse(ls[index].yesterday.toString())).output.withoutFractionDigits}",style: TextStyle(fontSize: 24,color: Colors.white),),
                            ),
                            Flexible(
                              flex: 1,
                              child: Container(
                                alignment: Alignment.center,
                                width: double.infinity,
                                color: Color.fromRGBO(255, 255, 255, 0.5),
                                child: Text(ls[index].title.toUpperCase(),style: TextStyle( fontWeight: FontWeight.bold,fontSize: 24,color: Colors.black),),
                              ),
                            )
                          ],
                        ),
                      ),
                    );
                  }),
                );
              },
            );
          }  else{
            return Text("loading");
          }
        }
    );
  }
}
```

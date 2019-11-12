# mmbuat scroll cview waw banget

```dart

class _TheApp extends State<TheApp> {

  String cOutlet = "RST";

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: "dosis",
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.amber,
          title: Text("Presto Mobile",style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold),),
          actions: <Widget>[
            Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: EdgeInsets.all(8),
                child: PilihKodeOutlet(
                  onCode: (String value){
                    setState(() {
                      cOutlet = value;
                    });
                  },
                ),
              ),
            )
          ],
        ),
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: CustomScrollView(
              slivers: <Widget>[
                SliverAppBar(
                  leading: Text("apa kabar"),
                  pinned: true,

                ),
                SliverList(
                    delegate: SliverChildListDelegate(
                      List.generate(100, (index){
                        return Text("ya");
                      }).toList(),

                    )
                ),
                SliverAppBar(
                  pinned: true,
                  expandedHeight: 200,
                  //floating: true,
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text("Sales trafic"),
                    centerTitle: true,
                    background: Text("Sales Trafict",style: TextStyle(fontSize: 60),),
                  ),
                ),
                SliverList(
                    delegate: SliverChildListDelegate(
                      List.generate(100, (index){
                        return Text("ya");
                      }).toList(),

                    )
                ),
              ],
            )
          ),
        ),
      ),
    );
  }
}


```

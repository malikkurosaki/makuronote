# flutter tab layout 

```dart

class TheApp extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _TheApp();
  }
}

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
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: NestedScrollView(headerSliverBuilder: (context,scroll){
              return <Widget>[
                SliverAppBar(
                  title: Text("Presto Mobile",style: TextStyle(color: Colors.black,fontWeight: FontWeight.bold),),
                  backgroundColor: Colors.amber[800],
                  pinned: true,
                  expandedHeight: MediaQuery.of(context).size.height/2,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.topRight,
                          colors: [
                            Colors.amber[300],
                            Colors.amber[500],
                            Colors.amber[800]
                          ]
                        ),
                        image: DecorationImage(
                          image: ExactAssetImage("assets/images/png_spl3.png")
                        )
                      ),
                      child:  Align(
                        alignment: Alignment.bottomRight,
                        child: Container(
                          padding: EdgeInsets.only(left: 8,right: 8),
                          width: double.infinity,
                          color: Color.fromRGBO(255, 255, 255, 0.5),
                          child: PilihKodeOutlet(onCode: (value){
                            setState(() {
                              cOutlet = value;
                            });
                          },),
                        ),
                      ),
                    ),
                  ),
                )
              ];
            }, body: CustomScrollView(
              slivers: <Widget>[
                SliverList(delegate: SliverChildListDelegate(
                  [
                    Container(
                      child: DefaultTabController(
                          length: 2,
                          child: Scaffold(
                            appBar: AppBar(
                              bottom: TabBar(
                                tabs: <Widget>[
                                  Tab(icon: Icon(Icons.show_chart,color: Colors.blue,),),
                                  Tab(icon: Icon(Icons.details,color: Colors.blue,),)
                                ],
                              ),
                              title: Text("Salest Trafic",style: TextStyle(color: Colors.blue,fontWeight: FontWeight.bold),),
                              flexibleSpace: FlexibleSpaceBar(
                                background: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.topRight,
                                      colors: [
                                        Colors.blue[300],
                                        Colors.blue[500],
                                        Colors.blue[800]
                                      ]
                                    )
                                  ),
                                ),
                              ),
                              backgroundColor: Color.fromRGBO(255, 255, 255, 0.5),
                            ),
                            body: TabBarView(
                                children: [
                                  CSalesTrafic(),
                                  SingleChildScrollView(
                                    child: Card(
                                      child: Container(
                                        padding: EdgeInsets.all(8),
                                        child: WSalesTrafic(cOutlet: cOutlet,),
                                      ),
                                    ),
                                  ),
                                ]
                            ),
                          )
                      ),
                      height: MediaQuery.of(context).size.height,
                    ),
                    Container(
                      child: DefaultTabController(
                          length: 2,
                          child: Scaffold(
                            appBar: AppBar(
                              bottom: TabBar(
                                tabs: <Widget>[
                                  Tab(icon: Icon(Icons.show_chart),),
                                  Tab(icon: Icon(Icons.details),)
                                ],
                              ),
                              title: Text("Salest Trafic"),
                            ),
                            body: TabBarView(
                                children: [
                                  CSalesTrafic(),
                                  SingleChildScrollView(
                                    child: Card(
                                      child: Container(
                                        padding: EdgeInsets.all(8),
                                        child: WSalesTrafic(cOutlet: cOutlet,),
                                      ),
                                    ),
                                  ),
                                ]
                            ),
                          )
                      ),
                      height: MediaQuery.of(context).size.height,
                    )
                  ]
                ))
              ],
            ))
          ),
        ),
      ),
    );
  }
}


```

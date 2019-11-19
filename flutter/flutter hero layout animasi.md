# flutter hero layout animasi

### widget

```dart

Container(
          child: InkWell(
            child: Hero(
              tag: "satu",
              child: CircleAvatar(
                child: Icon(Icons.account_balance_wallet),
              ),
            ),
            onTap: ()=>_MyHero(context),
          ),
```

### tujuannya

```dart


void _MyHero(BuildContext context){
  Navigator.of(context).push(MaterialPageRoute(builder: (context)=>Scaffold(
    body: Center(
      child: Container(
        color: Colors.red,
        child: Hero(
          tag: "satu",
          child: CircleAvatar(
            child: Icon(Icons.account_balance_wallet),
          ),
        ),
      ),
    ),
  )));
}

```


### tambah durasi

```dart


void _MyHero(BuildContext context){
  Navigator.push(context, PageRouteBuilder(
    transitionDuration: Duration(seconds: 1),
    pageBuilder: (_,__,___)=>Scaffold(
      appBar: AppBar(
        title: Text("Presto Mobile"),
      ),
      body: Center(
        child: Container(
          color: Colors.red,
          child: Hero(
            tag: "satu",
            child: CircleAvatar(
              child: Icon(Icons.account_balance_wallet),
            ),
          ),
        ),
      ),
    )
  ));
}

```




### update hero multiple

```dart
import 'dart:async';
import 'dart:math';
import 'package:carousel_pro/carousel_pro.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/widgets.dart';
import 'package:presto_mobile/layout/fb_home.dart';
import 'package:presto_mobile/helper/helper_api.dart';
import 'package:presto_mobile/helper/layout.dart';
import 'package:presto_mobile/layout/paymen_fb.dart';
import 'package:presto_mobile/helper/pilih_kode_outlet.dart';
import 'package:presto_mobile/layout/product_sales.dart';
import 'package:presto_mobile/layout/sales_performance.dart';
import 'package:presto_mobile/layout/sales_trafic.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:presto_mobile/layout/slide_show.dart';
import 'package:presto_mobile/layout/transaction_summary.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Splash(),
      ),
    );
  }
}

/// ================================
/// Splash screen
/// ================================
///
class Splash extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _Splash();
  }
}

class _Splash extends State<Splash> {




  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    // penentuan durasi splash
    Timer(Duration(seconds: 3),()=>Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context)=>new TheApp())));
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Stack(
          children: <Widget>[
            Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  fit: BoxFit.cover,
                  image: ExactAssetImage("assets/images/png_spl.png")
                )
              ),
            ),
            Container(
              color: Color.fromRGBO(50, 50, 50, 0.5),
            ),
            Center(
              child: Text("Presto Mobile",style: TextStyle(fontSize: 52,color: Colors.white,fontWeight: FontWeight.bold),),
            )
          ],
        ),
      ),
    );
  }
}

/// ====================================
/// THE APLIKASI MAINNYA ATAU UTAMANYA
/// ====================================
class TheApp extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _TheApp();
  }
}

class _TheApp extends State<TheApp> {

  String cOde = "RST";
  int _berapa;

  var warna = [
    Colors.blue,
    Colors.orange,
    Colors.red,
    Colors.green,
    Colors.yellow[700],
    Colors.purple,
    Colors.pinkAccent,
    Colors.blue[900]
  ];

  var iconNya = [
    Icons.code,
    Icons.today,
    Icons.show_chart,
    Icons.account_balance_wallet,
    Icons.album,
    Icons.widgets,
    Icons.web,
    Icons.view_list
  ];

  var judulNya = [
    "Total Gross Sales",
    "Paymen Summary",
    "Transaction Summary",
    "Report Overview",
    "Beverage Chart",
    "Food Chart",
    "Sales Trafic",
    "Sales Performance"
  ];




  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    String tag;
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue
      ),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: CustomScrollView(
              slivers: <Widget>[
                SliverAppBar(
                  backgroundColor: Color.fromRGBO(86, 171, 70,1),
                  forceElevated: true,
                  expandedHeight: MediaQuery.of(context).size.height/3,
                  flexibleSpace: FlexibleSpaceBar(
                    collapseMode: CollapseMode.parallax,
                    background: Container(
                      child: SlideShowNya(lebarnya: double.infinity,),
                    ),
                  ),
                ),

                /// =============================
                /// polih outlet
                /// ============================

                SliverAppBar(
                  pinned: true,
                  title: PilihKodeOutlet(
                    onCode: (code){
                      setState(() {
                        cOde = code;
                      });
                    },
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        mainAxisSize: MainAxisSize.max,
                        children: <Widget>[

                          /// ============================
                          /// bagian menu
                          /// ============================
                          ///
                          ///
                          Card(
                            semanticContainer: true,
                            margin: EdgeInsets.only(bottom: 16),
                            child: Container(
                              alignment: Alignment.center,
                              padding: EdgeInsets.all(8),
                              width: double.infinity,
                              child: Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: List.generate(judulNya.length, (x)=>InkWell(
                                  splashColor: Colors.blue,
                                  onTap: (){
                                    setState(() {
                                      tag = "menu$x";
                                      Navigator.push(context, PageRouteBuilder(
                                        transitionDuration: Duration(seconds: 1),
                                        pageBuilder: (_,__,___)=>DetailPage(tag: tag,)
                                      ));
                                    });
                                  },
                                  child: SizedBox(
                                    height: 100,
                                    width: 100,
                                    child: Container(
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.max,
                                        children: <Widget>[
                                          Flexible(
                                            fit: FlexFit.tight,
                                            flex: 1,
                                            child: Tooltip(
                                              message: judulNya[x],
                                              child: Hero(
                                                tag: tag == null?"menu$x":tag,
                                                child: CircleAvatar(
                                                  backgroundColor: warna[x],
                                                  child: Icon(iconNya[x]),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Center(
                                            child: Text(judulNya[x],overflow: TextOverflow.ellipsis,),
                                          )
                                        ],
                                      ),
                                    ),
                                  ),
                                )),
                              ),
                            ),
                          ),

                          Container(
                            child: Column(
                              children: <Widget>[
                                Container(
                                  child: Text("Fb Home",style: TextStyle(fontSize: 24,fontWeight: FontWeight.bold),),
                                  padding: EdgeInsets.all(8),
                                  alignment: Alignment.topLeft,
                                ),
                                FbHome(codeNya: cOde,),
                                ChartFbHome(codeNya: cOde,),
                              ],
                            ),
                          ),
                        ],
                      )
                    ]
                  ),
                )
              ],
            )
          ),
        ),
      ),
    );
  }
}

class MyBehavior extends ScrollBehavior{
  @override
  ScrollPhysics getScrollPhysics(BuildContext context) => ClampingScrollPhysics();

  @override
  Widget buildViewportChrome(BuildContext context, Widget child, AxisDirection axisDirection) => child;
}

class DetailPage extends StatelessWidget{

  final String tag;

  const DetailPage({Key key, this.tag}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Scaffold(
        body: Align(
          child: SafeArea(
            child: Hero(
              tag: tag,
              child: CircleAvatar(
                child: Icon(Icons.account_balance_wallet),
              ),
            ),
          ),
        ),
      ),
    );
  }

}


```

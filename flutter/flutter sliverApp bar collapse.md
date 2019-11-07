# flutter sliver appbar collapse

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:presto_online/helper/MyAppBar.dart';
import 'package:presto_online/helper/MyDrawer.dart';

class LayoutMain extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _LayoutMain();
  }

}

class _LayoutMain extends State<LayoutMain> {
  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        drawer: MyDrawer(),
          body: Align(
            child: SafeArea(
              child: CollapseAppBar(),
            ),
          )
      ),
    );
  }
}

class CollapseAppBar extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _CollapseAppBar();
  }
}

class _CollapseAppBar extends State<CollapseAppBar>  with SingleTickerProviderStateMixin{
  ScrollController _scrollController;
  TabController _tabController;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _scrollController = ScrollController(initialScrollOffset: 0.0);
    _tabController = TabController(vsync: this,length: 2);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    _tabController.dispose();
    _scrollController.dispose();
  }
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new NestedScrollView(
      controller: _scrollController,
        headerSliverBuilder: (BuildContext contex,bool innerBox){
          return <Widget>[
            new SliverAppBar(
              title: new Text("presto sliber"),
              pinned: true,
              floating: true,
              expandedHeight: 200,
              forceElevated: innerBox,
              flexibleSpace: FlexibleSpaceBar(
                background: Image.asset("assets/images/png_splash.jpeg",fit: BoxFit.cover,color: Color.fromRGBO(100,100, 100, 1),colorBlendMode: BlendMode.modulate,),
              ),
              bottom: new TabBar(
                  tabs: <Tab>[
                    new Tab(text: "satu",),
                    new Tab(text: "dua",)
                  ],
                labelColor: Colors.white,
                indicatorColor: Colors.red,
                indicator: BoxDecoration(
                  color: Colors.blue
                ),
                controller: _tabController,
              ),
            ),
          ];
        },
        body: new TabBarView(
            children: <Widget>[
              new Container(
                child: Text("halo apa kabar"),
              ),
              new Container(
                child: Text("ini text"),
              )
            ],
          controller: _tabController,
        )
    );
  }
}


```

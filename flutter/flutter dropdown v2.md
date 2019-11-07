# flutter drobdown v2

```java
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:presto_online/layout/LayoutDua.dart';
import 'package:presto_online/layout/LayoutSatu.dart';

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
    String _value;;
    var _nama = ["satu","dua","tiga","empat","lima","enam"];

    return new NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (BuildContext contex,bool innerBox){
          return <Widget>[
            new SliverAppBar(
              title: new Text("Presto Online"),
              pinned: true,
              floating: true,
              expandedHeight: 200,
              forceElevated: innerBox,
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  children: <Widget>[
                    Container(
                      width: double.infinity,
                      child: Image.asset("assets/images/png_splash.jpeg",fit: BoxFit.cover,color: Color.fromRGBO(100,100, 100, 1),colorBlendMode: BlendMode.modulate,),
                    ),
                    Align(
                      alignment: Alignment.topRight,
                      child: Container(
                        child: DropdownButton(
                          items: List<int>.generate(_nama.length,(index)=>(index)).map((index)=>DropdownMenuItem<String>(
                            child: Text(_nama[index]),
                            value: _nama[index],
                          )).toList(),
                          onChanged: (String value){
                            setState(() {
                                _value = value;
                                print(_value);
                            });
                          },
                          hint: Text("pilih",style: TextStyle(color: Colors.white),),
                          value: _value,
                          icon: Icon(Icons.add_box,color: Colors.blue,),

                        ),

                      )
                    )
                  ],
                )
              ),
              bottom: new TabBar(
                tabs: <Tab>[
                  new Tab(text: "satu",),
                  new Tab(text: "dua",)
                ],
                labelColor: Colors.white,
                indicatorColor: Colors.yellow,
                indicator: BoxDecoration(
                    color: Color.fromRGBO(100, 100, 100, 0.9),
                ),
                controller: _tabController,
              ),
            ),
          ];
        },
        body: new TabBarView(
          children: <Widget>[
            new LayoutSatu(),
            new LayoutDua()
          ],
          controller: _tabController,
        )
    );
  }
}


```

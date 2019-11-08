# dropdown data dari api

```dart 

import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:presto_online/layout/LayoutDua.dart';
import 'package:presto_online/layout/LayoutSatu.dart';
import 'package:http/http.dart' as http;
import 'HelperPojo.dart';

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
  Future<List<NamaOutlet>> listOutlet;

  var _value;
  var _nama = ["satu","dua","tiga","empat","lima","enam"];
  List<NamaOutlet> listNamaOutlet;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _scrollController = ScrollController(initialScrollOffset: 0.0);
    _tabController = TabController(vsync: this,length: 2);

    listOutlet = getNamaOutlet(http.Client());

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
                        // pilih outlet
                        child: FutureBuilder<List<NamaOutlet>>(
                          future: listOutlet,
                          builder: (context,snapShot){
                            if (snapShot.hasData) {
                              listNamaOutlet = snapShot.data;
                              return DropdownButton(
                                items: List<int>.generate(listNamaOutlet.length,(index)=>(index)).map((index)=>DropdownMenuItem<String>(
                                  child: Text(snapShot.data[index].nama_out,style: TextStyle(backgroundColor: Colors.white,color: Colors.black),),
                                  value: '$index',
                                )).toList(),
                                onChanged: (value) {
                                  this._value = listNamaOutlet[int.parse(value)].nama_out;
                                  print(listNamaOutlet[int.parse(value)].nama_out);

                                },
                                value: _value,
                                hint: Text(listNamaOutlet[0].nama_out),
                                icon: Icon(Icons.keyboard_arrow_down),
                              );
                            }
                            return Center(
                              child: CircularProgressIndicator(),
                            );
                          },
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
                    color: Colors.blue[300],
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



  List<NamaOutlet> setNamaOutlet(String response){
    final parsed = json.decode(response).cast<Map<String,dynamic>>();
    return parsed.map<NamaOutlet>((json)=>NamaOutlet.fromJson(json)).toList();
  }

  Future<List<NamaOutlet>> getNamaOutlet(http.Client client) async{
    final response = await client.get("https://purimas.probussystem.com:4450/api/getOutlets");
    return setNamaOutlet(response.body);
  }



  // dropfdow pilih outlet

  /*
DropdownButton(
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

  )
   */

}


```

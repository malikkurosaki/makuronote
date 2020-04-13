# appbar scroll auto tab bar dart

```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:update_corona/model/model_data_covid.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:update_corona/model/model_data_indonesia.dart';
import 'package:update_corona/view/layout_data_indonesia.dart';
import 'package:update_corona/view/layout_seluruh_negara.dart';
import 'package:update_corona/view/layout_top_10.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        appBarTheme: AppBarTheme(
          color: Color(0xff3D5B8F)
        )
      ),
      debugShowCheckedModeBanner: false,
      home: MyHome(),
    );
  }
}

class MyHome extends StatefulWidget{
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin{

  ScrollController _scrollController;
  TabController _tabController;
  ModelDataIndonesia _modelDataIndonesia;
  List<ModelDataCovid> _listDataCovid;

  Future<ModelDataIndonesia> _getIndonesiadata()async{
    final res = await http.get("https://corona.lmao.ninja/v2/countries/indonesia?yesterday=true&strict=true");
    return ModelDataIndonesia.fromJson(jsonDecode(res.body));
  }

  Future<List<ModelDataCovid>> _getListCovid()async{
    final res = await http.get("https://corona.lmao.ninja/v2/countries?yesterday=true&sort=cases");
    return jsonDecode(res.body).map<ModelDataCovid>((json)=>ModelDataCovid.fromJson(json)).toList();
  }

  @override
  void initState(){
    super.initState();
    print("disini");
    _scrollController = ScrollController();
    _tabController = TabController(length: 2, vsync: this);

    Future.microtask(()async{
      _getIndonesiadata().then((value){
        setState(() {
           _modelDataIndonesia = value;
        });
      });
      _getListCovid().then((value){
        setState(() {
          _listDataCovid = value;
        });
      });
    });
    
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body:NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              title: Text("Probus System"),
              pinned: true,
              floating: true,
              forceElevated: innerBoxIsScrolled,
              bottom: TabBar(
                controller: _tabController,
                tabs: [
                  Tab(text: "indonesia",),
                  Tab(text: "top 10",)
                ],
              ),
            )
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            LayoutDataIndonesia(dataIndonesia: _modelDataIndonesia),
            LayoutTop10(listDataCovid: _listDataCovid,)
          ],
        ),
      )
    );
  } 
}

```

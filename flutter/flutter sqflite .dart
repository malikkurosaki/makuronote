# flutter sqflite

```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:probus_mail_marketing/controller/bantuan.dart';
import 'package:probus_mail_marketing/view/layout_contact.dart';
import 'package:probus_mail_marketing/view/layout_home.dart';
import 'package:provider/provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite/sqlite_api.dart';
import 'package:path/path.dart';

void main(){
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
 
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => Bantuan(),)
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Probus Mail',
        theme: ThemeData(
          appBarTheme: AppBarTheme(
            color: Color(0xff456295)
          ),
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with SingleTickerProviderStateMixin{
 final _controllScroll = ScrollController();
 TabController _tabController;
 
 String _dataContact;

  Future<Database> database()async{
    Database db = await openDatabase(
      join(await getDatabasesPath(),"mail.db"),
      onCreate: (db, version){
        db.execute("create table email (id integer primary key autoincrement,nama text,email text)");
      },
      version: 1
    );
    print("buat");
    return db;
  }

  // Future<String> _ambilData()async{
  //   List<Map<String,dynamic>> dataNya = await _database.rawQuery("select * from email");
  //   return jsonEncode(dataNya).toString();
  // }


 @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2,vsync: this);
    database();
  }

 @override
  Widget build(BuildContext context) {
    
    return NestedScrollView(
      controller: _controllScroll,
      headerSliverBuilder: (context, innerBoxIsScrolled) => [
        SliverAppBar(
          title: Text("Probus Mail"),
          pinned: true,
          floating: true,
          forceElevated: true,
          bottom: TabBar(
            controller: _tabController,
            tabs: [
              Tab(text: "Home",icon: Icon(Icons.home),),
              Tab(text: "Contact",icon: Icon(Icons.contacts),)
            ],
          ),
        )
      ],
      body: TabBarView(
        controller: _tabController,
        children: [
          LayoutHome(
            dataContact: _dataContact,
            onAmbilData: ambilData,
          ),
          LayoutContact()
        ],
      ),
    );
  }

  ambilData(){
    setState(() {
      Future.microtask(()async{
        Database db = await database();
        //await db.rawInsert("insert into email(id) values(1)");
        List<Map<String,dynamic>> data = await db.rawQuery("select * from email");
        _dataContact = jsonEncode(data).toString();
      });
    });
  }

}

```

  
### update
```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:probus_mail_marketing/controller/bantuan.dart';
import 'package:probus_mail_marketing/view/layout_contact.dart';
import 'package:probus_mail_marketing/view/layout_home.dart';
import 'package:provider/provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite/sqlite_api.dart';
import 'package:path/path.dart';

void main()async{
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
 
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => Bantuan(),)
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Probus Mail',
        theme: ThemeData(
          appBarTheme: AppBarTheme(
            color: Color(0xff456295)
          ),
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with SingleTickerProviderStateMixin{
 final _controllScroll = ScrollController();
 TabController _tabController;
 
 String _dataContact;

  Future<Database> database()async{
    Database db = await openDatabase(
      join(await getDatabasesPath(),"mail.db"),
      version: 1
    );
    print("buat");
    return db;
  }

  Future<String> _ambilData()async{
    Database db = await database();
    List<Map<String,dynamic>> dataNya = await db.rawQuery("select * from content");
    return jsonEncode(dataNya).toString();
  }


 @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2,vsync: this);
    Future.microtask(()async{
      Database db = await database();
      await db.execute("CREATE table IF NOT EXISTS konten (para1,para2)");
      await db.rawInsert('insert into konten(para1,para2) values("malik","nama")');
      List<Map<String,dynamic>> data = await db.rawQuery("select * from konten");

      print(jsonEncode(data).toString());
    });
    
  }

 @override
  Widget build(BuildContext context) {
    
    return NestedScrollView(
      controller: _controllScroll,
      headerSliverBuilder: (context, innerBoxIsScrolled) => [
        SliverAppBar(
          title: Text("Probus Mail"),
          pinned: true,
          floating: true,
          forceElevated: true,
          bottom: TabBar(
            controller: _tabController,
            tabs: [
              Tab(text: "Home",icon: Icon(Icons.home),),
              Tab(text: "Contact",icon: Icon(Icons.contacts),)
            ],
          ),
        )
      ],
      body: TabBarView(
        controller: _tabController,
        children: [
          LayoutHome(
            dataContact: _dataContact,
            onAmbilData: ambilData,
          ),
          LayoutContact()
        ],
      ),
    );
  }

  ambilData(){
    setState(() {
      Future.microtask(()async{
        Database db = await database();
        //await db.rawInsert("insert into email(id) values(1)");
        List<Map<String,dynamic>> data = await db.rawQuery("select * from email");
        _dataContact = jsonEncode(data).toString();
      });
    });
  }

}
```


# komunikasi stateless dan statfull


statefull

```dart
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
 Database _database;
 String nama = "malik kayanya";

  Future<Database> database()async=> openDatabase(
    join(await getDatabasesPath(),"mail.db"),
    onCreate: (db, version) => db.execute("create table (id integer primary key autoincrement,nama text,email text)"),
    version: 1
  );

 @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2,vsync: this);
    Future.microtask(()async{
      if(_database == null){
        await database().then((value){
          setState(() {
             _database = value;
          });
        });
      }
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
            db: _database,
            nama: nama,
            onDatanya: (String data)=>panggil,
            onPanggil: datanya,
          ),
          LayoutContact()
        ],
      ),
    );
  }


  panggil(String apa){
    print(apa);
  }
  datanya(){
    setState(() {
      nama = "markonah";
    });
  }
}
```

stateless

```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:sqflite/sqlite_api.dart';

class LayoutHome extends StatelessWidget{

  final Database db;
  final VoidCallback onPanggil;
  final Function(String) onDatanya;
  final String nama;

  const LayoutHome({Key key, this.db,this.onPanggil, this.onDatanya, this.nama}) : super(key: key);

  Future<bool> testData()async{
    await db.insert("mail", {
      "nama":"malik",
      "email":"emailnya"
    });
    return true;
  }

  Future<bool> buatTable()async{
    await db.execute("create table mail(id integer primary key autoincrement,nama text,email text)");
    return true;
  }

  Future<String> getData()async{
    List<Map<String,dynamic>> data = await db.query("mail");
    return jsonEncode(data).toString();
  }

  @override
  Widget build(BuildContext context) {
    
    return Scaffold(
          body: db == null?Center(child: CircularProgressIndicator(),)
          :Container(
        child: ListView(
          children: [
            FlatButton(
              child: Text(nama??"load"),
              onPressed: onPanggil,
            )
          ],
        ),
      ),
    );
  }
}
```

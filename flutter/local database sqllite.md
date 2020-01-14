# local database sqllite

### dependendcy
```yaml
dependencies:
  sqlcool: ^4.2.0
  sqflite: ^1.2.0
```

### implementasi

```dart
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqlcool/sqlcool.dart';
import 'package:path/path.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  build(BuildContext context)=>MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Splash(),
  );
}

class Splash extends StatefulWidget {
  @override
  _Splash createState()=> _Splash();
}

class _Splash extends State<Splash>{

  _buatDatabase()async{
    Db db = Db();
    DbTable category = DbTable("catagory")
      ..varchar("nama",unique: true);

    DbTable product = DbTable("product")
      ..varchar("name",unique: true)
      ..integer("price")
      ..text("description")
      ..foreignKey("category",onDelete: OnDelete.cascade)
      ..index("name");

    List<DbTable> schema = [category,product];

    //String dbPath = "db.sqlite";

    var database_path = await getDatabasesPath();
    String path = join(database_path,"db.sqlite");

    await db.init(path: path,schema: schema).catchError((e){
      throw("error membuat database ${e.message}");
    });


   /* Map<String,String> simpan = {
      "nama":"malik"
    };

    await db.insert(table: "catagory", row: simpan).catchError((e){
      throw("error simpan data nama");
    });*/

    List<Map<String,dynamic>> getData = await db.select(table: "catagory").catchError((e){
      throw("error mendapatkan data ${e.toString()}");
    });

    print(getData);
  }


  @override
  build(BuildContext context){

    _buatDatabase();
    return Scaffold(
      body: Center(
        child: Container(
          child: Text("Probus"),
        ),
      ),
    );
  }
}


```

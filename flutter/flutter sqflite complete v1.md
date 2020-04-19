# flutter sqflite complete v1

main.dart

```dart

import 'dart:convert';

import 'package:appku/controll/controll_database.dart';
import 'package:appku/model/model_user.dart';
import 'package:dio/dio.dart';
import 'package:firebase_auth_ui/firebase_auth_ui.dart';
import 'package:firebase_auth_ui/providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:provider/provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite/sqlite_api.dart';


void main() {
  runApp(MyApp());
}



class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    
    return MultiProvider(
      providers: [
        FutureProvider(create: (context) => ControllDatabase.getUser(),),
        FutureProvider(create: (context) => ControllDatabase.database(),)
       
      ],
      child: MaterialApp(
        home: MyHome(),
      ),
    );
  }
}

class MyHome extends StatelessWidget{

  
  @override
  Widget build(BuildContext context) {
    final _user = Provider.of<List<ModelUser>>(context);
    final _db = Provider.of<Database>(context);
    

    Future.microtask(()async{
      if(_db!= null){
       print(jsonEncode(_user));
        
      }
    });
    return Scaffold(
      body: Container(
        child: SafeArea(
          child: Center(
            child: Text("loading",
              style: TextStyle(
                fontSize: 24
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

Model.user.dart

```dart
class ModelUser {
  String nama;
  String email;
  String image;
  int id;

  ModelUser({this.nama, this.email, this.image,this.id});

  ModelUser.fromJson(Map<String, dynamic> json) {
    nama = json['nama'];
    email = json['email'];
    image = json['image'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['nama'] = this.nama;
    data['email'] = this.email;
    data['image'] = this.image;
    data['id'] = this.id;
    return data;
  }
}
```

controller.dart

```dart
import 'dart:convert';

import 'package:appku/model/model_user.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite/sqlite_api.dart';

class ControllDatabase {

  static Future<Database> database()async{
    Database db = await openDatabase(
      join(await getDatabasesPath(),'appku.db'),
      version: 1,
      onCreate: (db, version)async {
        await db.execute("create table if not exists the_user(id integer primary key,nama text,email text,image text)");
      },
    );
    return db;
  }

  // masaukkan user
  static Future<int> insertUser(ModelUser user)async{
    Database db = await database();
    return db.insert('the_user', user.toJson(),conflictAlgorithm: ConflictAlgorithm.replace);
  }

  static Future<List<ModelUser>> getUser()async{
    final db = await database();
    final user = await db.query("the_user");
    return user.map<ModelUser>((json)=>ModelUser.fromJson(json)).toList();
  }

  Future<int> updataUser(ModelUser user)async{
    final db = await database();
    return db.update("the_user", user.toJson(),where: 'id=?',whereArgs: [user.id],conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> deleteUser(int id)async{
    final db = await database();
    return db.delete("the_user",where: 'id=?',whereArgs: [id]);
  }

  



}
```

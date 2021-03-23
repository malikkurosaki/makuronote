# sqlite helper


```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:makuro/views/my_home.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:get/get.dart';
import 'package:sqflite/sqflite.dart';


typedef OnCoba<T> = int Function(T);
abstract class MakuroQuery<@required T> extends MakuroDb{
  /// hasus diisi untuk nama kolom tabel database
  List<MakuroModel> get field;

  T fromJson(Map<String, dynamic> json);

  /// mendapatkan nama tabel yang diambil dari nama class
  String get tableName => this.toString().split(" ")[2].replaceAll("'", "");
  MakuroQuery();

  /// rubah data yang didapat ke json yang kemudian diteruskan ke dtabase
  Map<String, dynamic> toJson();

  /// merubah json menjadi object class
  MakuroQuery.fromJson(Map<String,dynamic> json);

  /// initial digunakan saat load pertamakalinya
  /// membuat tabel jika tabel belum dibuat
  init({bool force})async{
    final frc = force??false;

    if(frc){
      await database.execute("DROP TABLE IF EXISTS $tableName");
      await database.execute("CREATE TABLE IF NOT EXISTS $tableName ( ${field.map((e) => e.hasil).toList().join(",")})");
      printDebug("$tableName created FORCE");
    }
    else{
      await database.execute("CREATE TABLE IF NOT EXISTS $tableName ( ${field.map((e) => e.hasil).toList().join(",")})");
      printDebug("$tableName created ");
    }
  }

  /// menghapus tabel [tableName] seluruhnya dihapus
  deleteTable()async{
    await database.execute("DROP TABLE IF EXISTS $tableName");
    printDebug("$tableName deleted");
  }

  /// hanya membersihkan isi tabel tanpa menghapus tabelnya
  cleanTable()async{
    await database.execute("DELETE FROM $tableName");
    printDebug("$tableName cleanup");
  }


  /// mamasukkan data ke database [values] adalah bentuk map / json
  Future<int> insert(Map<String, dynamic> values)async{
    final id = await database.insert(tableName, values,
      conflictAlgorithm: ConflictAlgorithm.replace
    );
    return id;
  }

  addColumn(MakuroModel model)async{
    await database.execute("ALTER TABLE $tableName ADD COLUMN ${model.hasil}");
    printDebug("add collumn ${model.hasil}");
  }

  /// mendapatkan semua isi dalam tabel
  /// SELECT * FROM [tabelName]
  Future<List<Map<String, dynamic>>> findAll()async => await database.rawQuery("SELECT rowid, * FROM $tableName");
  
  Future<int> checkValue(String columnName, String value) async => Sqflite.firstIntValue(await database.rawQuery("select count(*) data  from $tableName where $columnName =  '$value'"));

  Future<int> delete(String id) async => database.delete(tableName, where: "id = ?", whereArgs: [id] );

  Future<int> getTotal() async => Sqflite.firstIntValue(await database.rawQuery("SELECT COUNT(*) total FROM $tableName"));

  Future searchBy(String field, String value) => database.rawQuery("SELECT * FROM $tableName WHERE $field LIKE '%$value%'");
}

typedef KetikaDibuat = Future Function();
class MakuroDb{
  /// penamaan nama database, bisa dirubah pada setiap class anakan
  static String _dbName = "myDb";
  String get dbName => _dbName;
  
  /// jika ingin prin log debug default adalah true
  static bool _debug = true;

  bool get debug => _debug;

  printDebug(String text){
    if(debug) print(text);
  }
  
  static int _version = 1;


  int get version => _version;


  static Database _database;


  Database get database => _database;

  static membuat(KetikaDibuat ketikaDibuat , {bool setDebug})async{
    if(setDebug != null) _debug = setDebug;

    try {
      String  path = join(await getDatabasesPath(), "$_dbName.db");
      _database = await openDatabase(
        path,
        version: _version,
      ); 
    } catch (e) {
      print(e.toString());
    }

    await ketikaDibuat();
  }

}

 class MakuroModel{

  String name;
  MakuroType type;
  bool primaryKey;
  bool notNull;
  bool unique;
  MakuroModel(
    {
      @required this.name, 
      @required this.type, 
      this.primaryKey,
      this.notNull,
      this.unique
    }
  );

  String get hasil => "$name ${type.hasil} ${primaryKey == null?'': !primaryKey? '': 'PRIMARY KEY'} ${notNull == null?'': 'NOT NULL'} ${unique == null?'': unique?'UNIQUE':''}";
}

class MakuroType{
  String type;
  MakuroType({this.type});

  /// CHARACTER(20)
  /// VARCHAR(255)
  /// VARYING CHARACTER(255)
  /// NCHAR(55)
  /// NATIVE CHARACTER(70)
  /// NVARCHAR(100)
  /// TEXT
  /// CLOB
  static MakuroType get text => MakuroType(type: "TEXT");

  /// INT
  /// INTEGER
  /// TINYINT
  /// SMALLINT
  /// MEDIUMINT
  /// BIGINT
  /// UNSIGNED BIG INT
  /// INT2
  /// INT8
  static MakuroType get integer => MakuroType(type: "INTEGER");

  /// BLOB
  /// no datatype specified
  static MakuroType get blob => MakuroType(type: "BLOB");

  /// REAL
  /// DOUBLE
  /// DOUBLE PRECISION
  /// FLOAT
  static MakuroType get real => MakuroType(type: "REAL");

  /// NUMERIC
  /// DECIMAL(10,5) as for money
  /// BOOLEAN
  /// DATE
  /// DATETIME
  static MakuroType get numeric => MakuroType(type: "NUMERIC");

  get hasil => "${this.type}";
}


```

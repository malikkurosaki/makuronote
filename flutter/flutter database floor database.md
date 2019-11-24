# floor database

```dart
import 'dart:async';
import 'dart:core';
import 'package:absen_ku/database/table_person.dart';
import 'package:absen_ku/database/the_dao.dart';
import 'package:flutter/material.dart';
import 'package:floor/floor.dart';
import 'package:absen_ku/database/the_db.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Scaffold(
        body: TheApp(),
      ),
    );
  }
}

class TheApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _TheApp();
  }
}

class _TheApp  extends State<TheApp> {

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Scaffold(
        body: Container(
          child: SafeArea(
            child: Container(
              child: FutureBuilder(
                future: theDatabase().then((val)=>val.findAllPerson()),
                builder: (context,snap){
                  if(snap.connectionState != ConnectionState.done) return Text("loading ...");
                  if(snap.hasError) return Text("error : ${snap.error}");
                  return Text(snap.data.toString());
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}


Future<TheDao> theDatabase() async {
  final db = await $FloorAppDatabase.databaseBuilder('thedb1.db').build();
  return db.theDb;
}
```


### database

```dart
import 'package:absen_ku/database/table_person.dart';
import 'package:absen_ku/database/the_dao.dart';
import 'package:floor/floor.dart';
import 'dart:async';
import 'package:floor/floor.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart' as sqflite;

part 'the_db.g.dart';

@Database(version: 2, entities: [TablePerson])
abstract class AppDatabase extends FloorDatabase{
  TheDao get theDb;
}
```

### table

```dart
import 'package:floor/floor.dart';

@Entity(tableName: "table_person")
class TablePerson {

  @PrimaryKey(autoGenerate: true)
  int id;

  final String name;

  TablePerson(this.id, this.name);
  TablePerson.name(this.name);
}

```

### dao

```dart
import 'package:absen_ku/database/table_person.dart';
import 'package:floor/floor.dart';

@dao
abstract class TheDao{
    @Query('select * from table_person')
    Future<List<TablePerson>> findAllPerson();

    @Query('select * from table_person where id=:id')
    Future<List<TablePerson>> findPersonId(int id);

    @insert
    Future<void> insertPerson(TablePerson tablePerson);
}
```

```yaml
name: absen_ku
description: aplikasi absen_ku

# The following defines the version and build number for your application.
# A version number is three numbers separated by dots, like 1.2.43
# followed by an optional build number separated by a +.
# Both the version and the builder number may be overridden in flutter
# build by specifying --build-name and --build-number, respectively.
# In Android, build-name is used as versionName while build-number used as versionCode.
# Read more about Android versioning at https://developer.android.com/studio/publish/versioning
# In iOS, build-name is used as CFBundleShortVersionString while build-number used as CFBundleVersion.
# Read more about iOS versioning at
# https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html
version: 1.0.0+1

environment:
  sdk: ">=2.1.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^0.1.2
  floor:
  sqflite:

dev_dependencies:
  flutter_test:
    sdk: flutter
  floor_generator:
  build_runner:



# For information on the generic Dart part of this file, see the
# following page: https://dart.dev/tools/pub/pubspec

# The following section is specific to Flutter.
flutter:

  # The following line ensures that the Material Icons font is
  # included with your application, so that you can use the icons in
  # the material Icons class.
  uses-material-design: true

  # To add assets to your application, add an assets section, like this:
  # assets:
  #  - images/a_dot_burr.jpeg
  #  - images/a_dot_ham.jpeg

  # An image asset can refer to one or more resolution-specific "variants", see
  # https://flutter.dev/assets-and-images/#resolution-aware.

  # For details regarding adding assets from package dependencies, see
  # https://flutter.dev/assets-and-images/#from-packages

  # To add custom fonts to your application, add a fonts section here,
  # in this "flutter" section. Each entry in this list should have a
  # "family" key with the font family name, and a "fonts" key with a
  # list giving the asset and other descriptors for the font. For
  # example:
  # fonts:
  #   - family: Schyler
  #     fonts:
  #       - asset: fonts/Schyler-Regular.ttf
  #       - asset: fonts/Schyler-Italic.ttf
  #         style: italic
  #   - family: Trajan Pro
  #     fonts:
  #       - asset: fonts/TrajanPro.ttf
  #       - asset: fonts/TrajanPro_Bold.ttf
  #         weight: 700
  #
  # For details regarding fonts from package dependencies,
  # see https://flutter.dev/custom-fonts/#from-packages

```

# flutter floor database



### main dart 

```dart

import 'package:absenku/task.dart';
import 'package:absenku/task_dao.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'database.dart';

void main() async{


  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: MyBody(),
          ),
        ),
      ),
    );
  }
}

class MyBody extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _MyBody();
  }
}

class _MyBody extends State<MyBody> {



  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      child:  Center(
        child: FutureBuilder(
          future: getDao(),
          builder: (context,snapshot){

            if (snapshot.connectionState == ConnectionState.done) {
              if(snapshot.hasError) return Text("error database");
              List<Task> ff = snapshot.data;

             /* Task task = new Task(1, "apa");
              dd.insertTask(task).whenComplete((){
                print("ya");
              });*/

              return Text("${ff.length}");
            }  else{
              return Text("loading ...");
            }

          },
        ),
      ),
    );
  }
}


Future<List<Task>> getDao() async{
  final database = await $FloorFlutterDatabase
      .databaseBuilder('flutter_database2.db')
      .build();
  final dao = database.taskDao;
  return dao.findAllTasks();
}


```


### database dart

```dart

import 'dart:async';
import 'package:absenku/task.dart';
import 'package:absenku/task_dao.dart';
import 'package:floor/floor.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart' as sqflite;

part 'database.g.dart';

@Database(version: 4, entities: [Task])
abstract class FlutterDatabase extends FloorDatabase {
  TaskDao get taskDao;
}

```

### pojo

```dart
import 'package:floor/floor.dart';

@entity
class Task {
  @PrimaryKey(autoGenerate: true)
  final int id;

  final String message;

  Task(this.id, this.message);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is Task &&
              runtimeType == other.runtimeType &&
              id == other.id &&
              message == other.message;

  @override
  int get hashCode => id.hashCode ^ message.hashCode;

  @override
  String toString() {
    return 'Task{id: $id, message: $message}';
  }
}

```


### dao

```dart

import 'package:absenku/task.dart';
import 'package:floor/floor.dart';

@dao
abstract class TaskDao {
  @Query('SELECT * FROM task WHERE id = :id')
  Future<Task> findTaskById(int id);

  @Query('SELECT * FROM task')
  Future<List<Task>> findAllTasks();

  @Query('SELECT * FROM task')
  Stream<List<Task>> findAllTasksAsStream();

  @insert
  Future<void> insertTask(Task task);

  @insert
  Future<void> insertTasks(List<Task> tasks);

  @update
  Future<void> updateTask(Task task);

  @update
  Future<void> updateTasks(List<Task> task);

  @delete
  Future<void> deleteTask(Task task);

  @delete
  Future<void> deleteTasks(List<Task> tasks);
}

```


# floor database consep baru

```dart


import 'package:absenku/helpernya.dart';
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

class  MyBody extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _MyBody();
  }
}


class _MyBody extends State<MyBody> {

  Future<TaskDao> getDb() async{
    final db = await $FloorFlutterDatabase.databaseBuilder("db.db").build();
    return db.taskDao;
  }
  Stream<List<Task>> flist;

  int _berapa = 55;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getDb().then((val){
      setState(() {
       flist = val.findAllTasksAsStream();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      child: Column(
        children: <Widget>[
          StreamBuilder(
            stream: flist,
            builder: (context,snap){

              if(!snap.hasData) return Text("loading ...");
              if(snap.hasError) return Text("db error");

              List<Task> ls = snap.data;
              return Flexible(
                fit: FlexFit.tight,
                flex: 1,
                child: ListView(
                  children: List.generate(ls.length, (x)=>Container(child: Text(ls[x].message,style: TextStyle(color: Colors.blue),),padding: EdgeInsets.all(8),)),
                ),
              );
            },
          ),
          RaisedButton(
            child: Text("tekan"),
            onPressed: (){
              getDb().then((val) async{
                _berapa ++;
                print("tekan");
                await val.insertTask(new Task.dol("ini dimana $_berapa")).whenComplete((){
                  setState(() {

                  });
                });
              });
            },
          )
        ],
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

# mendapatkan data dari firebase database


### passing data

```dart
Container(
  child: StreamBuilder(
    stream: _database.child("dataNya").onValue,
    builder: (context, snapshot) {
      if(!snapshot.hasData) return Text("data kosocng");
      _lsData.clear();
      DataSnapshot dataSnapshot = snapshot.data.snapshot;
      final Map<dynamic,dynamic> con = dataSnapshot.value;

      con.forEach((key, value) {

        _lsData.add(ModelDataNya.fromJson(jsonDecode(jsonEncode(value)),key));

      });


      return Container(
        child: ListView(
          children: List.generate(_lsData.length, (index) => ListTile(
            leading: IconButton(
              icon: Icon(Icons.delete),
              onPressed: () {
                _database.child("dataNya").child(_lsData[index].key).remove();
              },
            ),
            title: Text(_lsData[index].judul),
          )),
        ),
      );
    },
  ),
)
```

### model

```dart
import 'package:firebase_database/firebase_database.dart';

class ModelDataNya {
  String judul;
  String tag;
  String isi;
  String ket;
  String key;

  ModelDataNya({this.judul, this.tag, this.isi,this.ket,this.key});

  ModelDataNya.fromJson(Map<String, dynamic> json,String keys) {
    judul = json['judul'];
    tag = json['tag'];
    isi = json['isi'];
    ket = json['ket'];
    key = keys;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['judul'] = this.judul;
    data['tag'] = this.tag;
    data['isi'] = this.isi;
    data['ket'] = this.ket;
    return data;
  }

  ModelDataNya.fromSnapshot(DataSnapshot snapshot){
    Map<dynamic,dynamic> data = snapshot.value;
    data.forEach((key, value) {
      key = key;
      judul = value['judul'];
      tag = value['tag'];
      isi = value['isi'];
      ket = value['ket'];
    });
   

  }
}
```

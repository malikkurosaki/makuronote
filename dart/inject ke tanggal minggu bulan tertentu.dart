# inject ke tanggal bulan minggu tertentu

```dart


import 'dart:convert';

void main() {
  final tanggalan = DateTime(2021, 2, 10);
  final List ls = Percobaan.sebulan(2021, 4)['week'];

  final tanggal = 4;
  final lsMap = ls.map((e) => e.where( (e) => e["type"] != 0 && e["type"] != 2).toList().map( (e) => e['value']).toList()).toList();
  final idx = lsMap.map( (e) => e.indexOf(tanggal)).toList().indexWhere((element) => element != -1);
  final index = ls[idx].indexWhere((e) => e['value'] == tanggal);
  print(index);
}

class Percobaan{

  static final setahun = List.generate(12, (index) => sebulan(2021, index + 1));

  static Map sebulan(int tahun, int bulan){
    final tanggal = DateTime(tahun, bulan);
    final minggu = tanggal.weekday;
    final totalHari = DateTime(tahun, bulan + 1, 0).day;
    var date = 1;
    var bulanan = {};
    bulanan['month'] = bulan;
    bulanan['week'] = [];
    for(var j = 0; j < ((minggu + totalHari) / 7).ceil(); j++) {
      bulanan['week'].add([]);
      int awal = tanggal.subtract(Duration(days: tanggal.weekday )).day;
      int akhir = 1;
      for(var i = 0; i < 7 ; i++) {
          var isi = {};
          if(j == 0 && i < minggu) {
            isi = {
              "type": 0,
              "value": awal ++
            };
          } 
          else if(totalHari >= date) {
              isi = {
                "type": 1,
                "value": date
              };
              date++;
          }
          else if(date > totalHari){
            isi = {
              "type": 0,
              "value": akhir ++
            };
          }
          bulanan['week'][j].add(isi);
      }
    }
   
    return bulanan;
  }
}


```

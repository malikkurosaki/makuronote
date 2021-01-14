# buat tanggalan lengkap | complete calendar

```dart


import 'dart:convert';

void main() {
  print(Percobaan.sebulan(2021, 3));
}

class Percobaan{
  static final tanggalan = DateTime(2021, 4);
  static final tahun = tanggalan.year;
  static final bulan = tanggalan.month;

  static final setahun = List.generate(12, (index) => sebulan(tahun, index + 1));

  static sebulan(int tahun, int bulan){
    final tanggal = DateTime(tahun, bulan);
    final minggu = tanggal.weekday;
    final totalHari = DateTime(tahun, bulan + 1, 0).day;
    var date = 1;
    var mingguan = [];
    
    for(var j = 0; j < ((minggu + totalHari) / 7).ceil(); j++) {
      mingguan.add([]);
      int awal = tanggal.subtract(Duration(days: tanggal.weekday )).day;
      int akhir = 1;
      for(var i = 0; i < 7 ; i++) {
          var isi = 0;
          if(j == 0 && i < minggu) {
            isi = awal ++;
          } 
          else if(totalHari >= date) {
              isi = date;
              date++;
          }
          else if(date > totalHari){
            isi = akhir ++;
          }
          mingguan[j].add(isi);
      }
    }
   
    return mingguan;
  }
}


```

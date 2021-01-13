# buat tanggalan setahun

```dart


import 'dart:convert';

void main() {
 print(JsonEncoder.withIndent("  ").convert(Percobaan.setahun));
}

class Percobaan{
  static final tanggalan = DateTime(2021, 1);
  static final tahun = tanggalan.year;
  static final bulan = tanggalan.month;

  static final setahun = List.generate(12, (index) => sebulan(tahun, index + 1));

  static sebulan(int tahun, int bulan){
    final tanggal = DateTime(tahun, bulan);
    final minggu = tanggal.weekday;
    final totalHari = DateTime(tanggal.year, tanggal.month + 1, 0).day;
    var date = 1;
    var mingguan = [];
    var harian = [];
    
    for(var j = 0; j < (totalHari / 7).ceil() + 1; j++) {
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
          harian.add(isi);
      }
    }
    return mingguan;
  }
}



```

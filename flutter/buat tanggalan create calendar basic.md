# buat tanggalan create calendar

```dart


void main() {
 final tanggal = DateTime(2021, 1);
 
 final minggu = tanggal.weekday;
 final totalHari = DateTime(tanggal.year, tanggal.month + 1, 0).day;

  var date = 1;
  var hasil = [];

  for(var j = 0; j < 6; j++) {
      hasil.add([]);
      for(var i = 0; i < 7 ; i++) {
          var textNode = "";
          if(j == 0 && i < minggu) {
              textNode = "x";
          } else if(totalHari >= date) {
              textNode = "$date";
              date++;
          }
          else break;
          hasil[j].add(textNode);
      }
  }

 print(hasil);
 
}


```

# super simple calendar month

```dart
 static cobaTanggalan(DateTime kal, int date){
    final totalHari = DateTime(kal.year, kal.month + 1, 0).day;
    final hasil = List.generate(((kal.weekday + totalHari) / 7).ceil(), (i1) => 
      List.generate(7, (i2) => i1 == 0 && i2 < kal.weekday? 
      kal.subtract(Duration(days: kal.weekday)).day +i2: totalHari >= date ? date ++: i2++)
    );
    print(hasil);
  }
 ```

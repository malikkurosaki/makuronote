<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [mendapatkan jumblah hari dalam satu bulan](#mendapatkan-jumblah-hari-dalam-satu-bulan)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mendapatkan jumblah hari dalam satu bulan

```dart
void main() {
  final List hari = DateTime.now().toIso8601String().split("T")[0].split("-");
  final tahun = int.parse(hari[0]);
  final int bulan = int.parse(hari[1]) + 1;
  final tanggal = int.parse(hari[2]);


  print(DateTime(tahun, bulan, 0).day.toString());
}
```

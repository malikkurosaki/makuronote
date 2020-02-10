# menghitung nilai list secara langsung

```dart
print(jsonEncode(value.listTampunganOrderProduk.map((e) => e.harga_pro).reduce((value, element) => value+element)));
```

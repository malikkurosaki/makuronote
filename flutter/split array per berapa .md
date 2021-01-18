# split array per berapa item

```dart
final List aya = Ini.hitung("2021-01-01");
final itu = aya.fold([[]], (list, x) => list.last.length == 5? (list..add([x])) : (list..last.add(x)));
```

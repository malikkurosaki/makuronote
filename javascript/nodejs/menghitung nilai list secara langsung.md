<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [menghitung nilai list secara langsung](#menghitung-nilai-list-secara-langsung)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# menghitung nilai list secara langsung

```dart
print(jsonEncode(value.listTampunganOrderProduk.map((e) => e.harga_pro).reduce((value, element) => value+element)));
```

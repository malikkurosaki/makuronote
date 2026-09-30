<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [split array per berapa item](#split-array-per-berapa-item)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# split array per berapa item

```dart
final List aya = Ini.hitung("2021-01-01");
final itu = aya.fold([[]], (list, x) => list.last.length == 5? (list..add([x])) : (list..last.add(x)));
```

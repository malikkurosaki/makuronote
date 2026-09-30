<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [merubah tieme amp int to date time](#merubah-tieme-amp-int-to-date-time)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# merubah tieme amp int to date time

```yaml
dependencies:
  intl: ^0.16.1
```

```dart
int timeInMillis = 1586348737122;
var date = DateTime.fromMillisecondsSinceEpoch(timeInMillis);
var formattedDate = DateFormat.yMMMd().format(date); // Apr 8, 2020
```

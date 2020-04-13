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

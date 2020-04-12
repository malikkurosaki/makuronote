# merubah tieme amp int to date time

```dart
int timeInMillis = 1586348737122;
var date = DateTime.fromMillisecondsSinceEpoch(timeInMillis);
var formattedDate = DateFormat.yMMMd().format(date); // Apr 8, 2020
```

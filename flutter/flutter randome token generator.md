# flutter random token generator

```dart
import 'dart:core';
import 'dart:math';

const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

String RandomString(int strlen) {
  Random rnd = new Random(new DateTime.now().millisecondsSinceEpoch);
  String result = "";
  for (var i = 0; i < strlen; i++) {
    result += chars[rnd.nextInt(chars.length)];
  }
  return result;
}

void main() {
  print(RandomString(10));
  print(RandomString(20));
}
```

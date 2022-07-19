```dart
try {
      ini = groupBy(List<Map>.from(datanya), (x) => jsonDecode(jsonEncode(x))["Client"]['name']).map(
        (key, value) => MapEntry(
          key,
          groupBy(value, (x) => jsonDecode(jsonEncode(x))["Product"]['name'])
              .map(
                (key, value) => MapEntry(key, value),
              )
              .map(
                  (key, value) => MapEntry(key, groupBy(value, (x) => jsonDecode(jsonEncode(x))['IssueType']['name']))),
        ),
      );

      print(ini);
    } catch (e) {
      print(e);
    }
```

# membuat layout sekaligus

```dart

ListView(
      children: List<int>.generate(20,(index)=>index).map((index)=>Container(
        height: 40,
        child: Text('$index item'),

      )).toList(),
    )
```

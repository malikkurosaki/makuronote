# flutter membuat pagevie

```dart
@override
  Widget build(BuildContext context) {
    // TODO: implement build


    return PageView(
      controller: controller,
      children: <Widget>[
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.amber,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.blue,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.yellow,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.red,
        )
      ],
    );
    
```

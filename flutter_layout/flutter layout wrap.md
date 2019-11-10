# flutter layout wrap

> membuat layout responsive

```dart
 @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Wrap(
      children: <Widget>[
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(16),
          color: Colors.red,
          child: Text("apa kabranya"),
        ),
        Container(
          color: Colors.blue,
          padding: EdgeInsets.all(16),
          child: Text("apa kabar juga"),
        )
      ],
    );
    
```

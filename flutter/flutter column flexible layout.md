# flutter column flexible lyout

```dart 

@override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Column(
      children: <Widget>[
        Flexible(
          flex: 2,
          fit: FlexFit.tight,
          child: Container(
            color: Colors.blue,
            child: Text("ini layout satu"),
          ),
        ),
        Flexible(
          flex: 1,
          child: Container(
            color: Colors.yellow,
            child: Text("ini layout dua"),
          ),
        )
      ],
    );
    
```

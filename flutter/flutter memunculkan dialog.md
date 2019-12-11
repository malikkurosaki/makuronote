# flutter memunculkan dialong 


```dart

void main()=>runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      home: Home(),
    );
  }
}

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Container(
        child: SafeArea(
          child: Container(
            child: FlatButton(
              child: Text("apa kabar"),
              onPressed: ()=>showDialog(context: context,builder: (_)=>Dialog(child: Text("apa kabarnya"),)),
            ),
          ),
        ),
      ),
    );
  }
}
```

### dialong v2

```dart

void main()=>runApp(MyApp());

class MyApp extends StatelessWidget {

  final _kunci = new GlobalKey<NavigatorState>();
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      navigatorKey: _kunci,
      home: Scaffold(
        body: Container(
          child: SafeArea(
            child: Container(
              child: FlatButton(
                child: Text("pop"),
                onPressed: ()=>showDialog(context: _kunci.currentState.overlay.context,builder: (_)=>Dialog(child: Text("apa kabarnya"),)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

```

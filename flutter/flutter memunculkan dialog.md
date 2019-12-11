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

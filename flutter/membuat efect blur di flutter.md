# membuat effect blur flutetr


```dart
Widget getLayoutLogin(BuildContext context){
    return Scaffold(
      body: new Stack(
        children: <Widget>[
          ConstrainedBox(
            constraints: BoxConstraints.expand(),
            child: Image.network("https://i.postimg.cc/C1fwJyGx/b0y3-rsr001-00-p-1024x768.jpg",fit: BoxFit.cover,),
          ),
          Container(
            padding: EdgeInsets.all(32),
            child: Center(
              child: ClipRRect(
                child: BackdropFilter(
                  filter: ImageFilter.blur(
                      sigmaX: 10,
                      sigmaY: 10
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      TextField()
                    ],
                  ),
                ),
              ),
            ),
          )
        ],
      )
    );
  }
  
```

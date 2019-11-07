# flutter collapse app bar

```dart

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:presto_online/helper/MyAppBar.dart';

class LayoutMain extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _LayoutMain();
  }

}

class _LayoutMain extends State<LayoutMain> {
  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          body: Align(
            child: SafeArea(
              child: CustomScrollView(
                slivers: <Widget>[
                  SliverAppBar(
                    expandedHeight: 200,
                    pinned: true,
                    flexibleSpace: FlexibleSpaceBar(
                      title: Text("Presto Online"),
                      background: Image.asset("assets/images/png_splash.jpeg",fit: BoxFit.cover,color: Color.fromRGBO(100,100, 100, 1),colorBlendMode: BlendMode.modulate,),
                    ),
                  ),
                  SliverFillRemaining(
                    child:Container(
                      child: Text("ini text"),
                    ),
                  ),
                ],
              ),
            ),
          )
      ),
    );
  }
}
```

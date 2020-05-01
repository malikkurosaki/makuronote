# flutter router

```
dependencies:
  rest_router: ^0.1.0
```

```dart
import 'package:flutter/material.dart';
import 'package:rest_router/parser.dart';
import 'package:rest_router/rest_navigator.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  final router = Router({
    "/": (BuildContext context, parameters) => HomePage(),
    "/items": (BuildContext context, parameters) => SubPage("path is /items"),
    "/plus_two/:num": (BuildContext context, parameters) => SubPage("sum is ${int.parse(parameters["num"]?.first) + 2}"),
  }, onUnknownRouteHandler: (BuildContext context, parameters) => SubPage("${parameters[urlPathKey]?.first} is 404"));

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rest navigator demo',
      initialRoute: "/",
      onGenerateRoute: router.generator,
    );
  }
}

/// Navigates to sub pages.
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("/")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            RaisedButton(
              child: Text("Item list"),
              onPressed: () => Navigator.of(context).pushNamed("/items", arguments: TransitionType.native),
            ),
            RaisedButton(
              child: Text("Run /plus_two/40"),
              onPressed: () => Navigator.of(context).pushNamed("/plus_two/40", arguments: TransitionType.native),
            ),
            RaisedButton(
              child: Text("Invalid path"),
              onPressed: () => Navigator.of(context).pushNamed("/itemz"), // Defaults to instant transition
            ),
          ],
        ),
      ),
    );
  }
}

/// Scaffold with app bar title.
class SubPage extends StatelessWidget {
  final String title;

  SubPage(this.title);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
    );
  }
}
```

# flutter life cycle

```dart
class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {...}
```

```dart
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addObserver(this);
}
```

```dart
@override
void dispose() {
  WidgetsBinding.instance.removeObserver(this);
  super.dispose();
}
```

```dart
@override
void didChangeAppLifecycleState(AppLifecycleState state) {
  if(state == AppLifecycleState.resumed){
    _showPasswordDialog();
  }
}
```


```dart
@override
void didChangeAppLifecycleState(AppLifecycleState state) {
  if(state == AppLifecycleState.resumed){
    // user returned to our app
  }else if(state == AppLifecycleState.inactive){
    // app is inactive
  }else if(state == AppLifecycleState.paused){
    // user is about quit our app temporally
  }else if(state == AppLifecycleState.suspending){
    // app suspended (not used in iOS)
  }
}

```


source : https://dev.to/pedromassango/onresume-and-onpause-for-widgets-on-flutter-27k2

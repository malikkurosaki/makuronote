<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

#flutter firebase messaging 

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider:
  shared_preferences:
  firebase_core: 
  firebase_database: 
  firebase_messaging:
```

```dart
 Future.microtask(()async{
    FirebaseMessaging().configure(
      onMessage: (message)async{

        print(message.toString());
      },
      onLaunch: (message)async{
        print(message.toString());
      }
    );
    FirebaseMessaging().getToken().then((value) =>print(value));
  });
```

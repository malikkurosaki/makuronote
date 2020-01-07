# future didalam onclick future


```dart
FlatButton(
      child: Text("masuk"),
      onPressed: () async {
        if(_kunciForm.currentState.validate()){
          Map<String,dynamic> data = {
            "email":_controller[0].text,
            "password":_controller[1].text
          };

          await _login.getDataLogin();
          print(_login.dataLogin);

        }
      },
    )
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [future didalam onclick future](#future-didalam-onclick-future)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

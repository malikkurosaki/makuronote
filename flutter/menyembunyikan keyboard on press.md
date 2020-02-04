# menyembunyikan keyboard on press

```dart
FlatButton(
    child: Text("save"),
    onPressed: (){
      FocusScope.of(context).unfocus();
    },
  )
```
                  

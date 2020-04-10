# unfocus text field text edit flutter

```dart
FocusScope.of(context).requestFocus(new FocusNode()); //remove focus
WidgetsBinding.instance.addPostFrameCallback((_) => _textControll.clear());
```

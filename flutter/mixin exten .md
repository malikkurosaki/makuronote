# mixin exten 

```dart
import 'package:flutter/cupertino.dart';

extension Malik on Text{
  
  Text nama(){
    return Text(this.data,
      style: TextStyle(
        fontSize: 25
      ),
    );
  }
}
```

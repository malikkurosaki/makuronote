<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [menyembunyikan keyboard on press](#menyembunyikan-keyboard-on-press)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# menyembunyikan keyboard on press

```dart
FlatButton(
    child: Text("save"),
    onPressed: (){
      FocusScope.of(context).unfocus();
    },
  )
```
                  

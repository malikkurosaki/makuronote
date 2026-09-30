<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [remove node focus text field](#remove-node-focus-text-field)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# remove node focus text field

```dart
GestureDetector(
onTap: (){
  FocusScope.of(context).requestFocus(new FocusNode());
},
```
      

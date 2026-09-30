<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter input text](#flutter-input-text)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter input text


```dart
// buat controllernya
var txt = TextEditingController();


// buat text inputnya

TextField(
  textAlign: TextAlign.start,
  controller: txt,
  decoration: InputDecoration(
    hintText: "isi disini aja"
  ),

)

```

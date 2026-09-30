<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter membuat pagevie](#flutter-membuat-pagevie)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter membuat pagevie

```dart
@override
  Widget build(BuildContext context) {
    // TODO: implement build


    return PageView(
      controller: controller,
      children: <Widget>[
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.amber,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.blue,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.yellow,
        ),
        Container(
          padding: EdgeInsets.all(16),
          color: Colors.red,
        )
      ],
    );
    
```

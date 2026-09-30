<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [flutter layout wrap](#flutter-layout-wrap)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter layout wrap

> membuat layout responsive

```dart
 @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Wrap(
      children: <Widget>[
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(16),
          color: Colors.red,
          child: Text("apa kabranya"),
        ),
        Container(
          color: Colors.blue,
          padding: EdgeInsets.all(16),
          child: Text("apa kabar juga"),
        )
      ],
    );
    
```

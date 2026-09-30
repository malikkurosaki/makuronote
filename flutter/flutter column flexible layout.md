<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [flutter column flexible lyout](#flutter-column-flexible-lyout)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter column flexible lyout

```dart 

@override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Column(
      children: <Widget>[
        Flexible(
          flex: 2,
          fit: FlexFit.tight,
          child: Container(
            color: Colors.blue,
            child: Text("ini layout satu"),
          ),
        ),
        Flexible(
          flex: 1,
          child: Container(
            color: Colors.yellow,
            child: Text("ini layout dua"),
          ),
        )
      ],
    );
    
```

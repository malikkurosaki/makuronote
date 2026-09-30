<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [membuat layout sekaligus](#membuat-layout-sekaligus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# membuat layout sekaligus

```dart

ListView(
      children: List<int>.generate(20,(index)=>index).map((index)=>Container(
        height: 40,
        child: Text('$index item'),

      )).toList(),
    )
```

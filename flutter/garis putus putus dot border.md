<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [garis putus putus dow border](#garis-putus-putus-dow-border)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# garis putus putus dow border

```dart
 Row(
  children: List.generate(150~/10, (index) => Expanded(
    child: Container(
      color: index%2==0?Colors.transparent:Colors.grey,
      height: 2,
      child: Text("apa kabar"),
    ),
  )),
),
```
                                      

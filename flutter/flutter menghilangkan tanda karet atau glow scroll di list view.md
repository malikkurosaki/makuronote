<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [flutter menghilangkan tanda glow di scroll](#flutter-menghilangkan-tanda-glow-di-scroll)
    - [buat class behavior](#buat-class-behavior)
    - [implemen](#implemen)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter menghilangkan tanda glow di scroll


### buat class behavior

```dart
class MyBehavior extends ScrollBehavior {
  @override
  Widget buildViewportChrome(
      BuildContext context, Widget child, AxisDirection axisDirection) {
    return child;
  }
}
```

### implemen

``` dart
ScrollConfiguration(
  behavior: MyBehavior(),
  child: ListView(
    ...
  ),
)
```

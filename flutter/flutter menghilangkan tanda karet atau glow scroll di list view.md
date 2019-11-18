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

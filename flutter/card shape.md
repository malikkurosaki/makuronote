# flutter card shape

```dart

Card(
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(15.0),
  ),
  child: Text(
    'Card with circular border',
    textScaleFactor: 1.2,
  ),
),
Card(
  shape: BeveledRectangleBorder(
    borderRadius: BorderRadius.circular(10.0),
  ),
  child: Text(
    'Card with Beveled border',
    textScaleFactor: 1.2,
  ),
),
Card(
  shape: StadiumBorder(
  side: BorderSide(
    color: Colors.black,
    width: 2.0,
  ),
),
  child: Text(
    'Card with Beveled border',
    textScaleFactor: 1.2,
  ),
),

```

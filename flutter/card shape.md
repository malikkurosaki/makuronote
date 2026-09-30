<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter card shape](#flutter-card-shape)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

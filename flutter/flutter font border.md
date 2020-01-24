# flutter font border

```dart
Stack(
  children: <Widget>[
    // Stroked text as border.
    Text(
      'Greetings, planet!',
      style: TextStyle(
        fontSize: 40,
        foreground: Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 6
          ..color = Colors.blue[700],
      ),
    ),
    // Solid text as fill.
    Text(
      'Greetings, planet!',
      style: TextStyle(
        fontSize: 40,
        color: Colors.grey[300],
      ),
    ),
  ],
)
```

# create dot dash

```dart
Container(
  alignment: Alignment.center,
  width: double.infinity,
  child: Row(
    children: [
      for(var i = 0; i < MediaQuery.of(context).size.width/16;i++)
      Expanded(
        child: Container(
          width: 10,
          height: 1,
          margin: EdgeInsets.symmetric(horizontal: 2),
          color: Colors.grey,
        ),
      )
    ],
  )
)
```

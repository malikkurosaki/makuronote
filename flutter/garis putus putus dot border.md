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
                                      

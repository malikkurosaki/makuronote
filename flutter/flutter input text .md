# flutter input text


```dart
// buat controllernya
var txt = TextEditingController();


// buat text inputnya

TextField(
  textAlign: TextAlign.start,
  controller: txt,
  decoration: InputDecoration(
    hintText: "isi disini aja"
  ),

)

```

# flutter membuat tabel

> mudah membuat tabel menggunakan flutter

```dart
@override
  Widget build(BuildContext context) {
    // TODO: implement build


    return Table(
      border: TableBorder.all(),
      children: [
        TableRow(
          children: [
            Text("ini text satu"),
            Text("ini text dua"),
            Text("ini text tiga")
          ]
        ),
        TableRow(
          children: [
            Text("ini tabel tiga"),
            Text("ini tabel empat"),
            Text("ini tabel empat")
          ]
        )
      ],
    );
    
    
```

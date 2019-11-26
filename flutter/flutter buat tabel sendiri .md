# flutter buat tabel sendiri

```dart
 Container(
  decoration: BoxDecoration(
    border: Border.all(color: Colors.grey)
  ),
  child: SingleChildScrollView(
    child: Column(
      children: <Widget>[
        Column(
          children: [
            Row(
              children: _judul.map((e)=>Expanded(flex: 1,child: Container(
                child: Text(e,style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold),textAlign: TextAlign.center,),
                color: Colors.grey,
                padding: EdgeInsets.all(8),
              ),)).toList(),
            )
          ],
        ),
        Container(
          color: Colors.white,
          child: Column(
            children: listTable.map((f)=>Row(
              children: <Widget>[
                Expanded(
                  flex: 1,
                  child: Container(
                    alignment: Alignment.topLeft,
                    padding: EdgeInsets.all(8),
                    child: Text(f.name),
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Container(
                    alignment: Alignment.topRight,
                    padding: EdgeInsets.all(8),
                    child: Text(f.qty),
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Container(
                    alignment: Alignment.topRight,
                    padding: EdgeInsets.all(8),
                    child: Text(f.price),
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Container(
                    alignment: Alignment.topRight,
                    padding: EdgeInsets.all(8),
                    child: Text(f.total),
                  ),
                ),
              ],
            )).toList(),
          ),
        )
      ],
    ),
  ),
)
              
              
              
```

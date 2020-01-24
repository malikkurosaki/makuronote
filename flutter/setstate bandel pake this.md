# setsatate bandel cpake this aja

```dart
Container(
    alignment: Alignment.centerRight,
    width: double.infinity,
    child: RaisedButton(
      color: Warna.PRIMARY,
      child: Text("Edit",style: TextStyle(color: Colors.white),),
      onPressed: (){
        this.setState((){
          _lsTableOrder[idx].qty = "600";
        });
      },
    ),
  )
```

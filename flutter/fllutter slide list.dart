# flutter slide list

`flutter_slidable:`

```dart
Slidable(
actionExtentRatio: _cProduk.listProduk[x].qty==null?0.0:0.1,
actionPane: SlidableScrollActionPane(),

actions: <Widget>[
  // IconSlideAction(
  //   icon: Icons.remove_circle,
  //   color: Colors.red,
  //   onTap: (){
  //     _cProduk.listProduk[x].qty = null;
  //     _cProduk.listProduk = _cProduk.listProduk;
  //   },
  // )
  IconSlideAction(
    icon: Icons.arrow_back_ios,
    color: Color(0xff3c5589),
    onTap: (){

    },
  ),
  IconSlideAction(
    icon: Icons.arrow_forward_ios,
    color: Color(0xff3c5589),
    onTap: (){

    },
  )
]
```

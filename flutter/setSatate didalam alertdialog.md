# set satate didalam aler dialog


```dart
showDialog(
    context: context,
  builder: (BuildContext context){
      return AlertDialog(
        content: StatefulBuilder(
          builder: (context,setState){
            return Column(
              children: <Widget>[
                Text("Edit"),
                TextField(
                  controller: _countController,
                  decoration: InputDecoration(
                    labelText: "input number",
                  ),
                  keyboardType: TextInputType.number,
                ),
              ],
            );
          },
        ),
        actions: <Widget>[
          OutlineButton(
            child: Text("OK"),
            onPressed: (){
              setState((){
                _lsPilihproduk[x].count = int.parse(_countController.text.toString());
              });
            },
          )
        ],
      );
  }
);
```

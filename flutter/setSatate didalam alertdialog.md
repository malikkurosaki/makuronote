<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [set satate didalam aler dialog](#set-satate-didalam-aler-dialog)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

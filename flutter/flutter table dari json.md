# flutter json to table


### dependency

`dependencies:
  json_table: <latest version>`


### import

`import 'package:json_table/json_table.dart';`


```dart
FutureBuilder(
    future: getFbHome(HelperApi.getCodeNya),
    builder: (context,snap){

      if(snap.connectionState != ConnectionState.done) return Text("losding");
      if(snap.hasError) return Text("error");

      var rr = json.encode(snap.data);


      return Container(
        padding: EdgeInsets.all(8),
        child: Center(
          child: JsonTable(
            json.decode(rr),
            tableHeaderBuilder: (String header) {
              return Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: Colors.grey,
                    border: Border.all(width: 2,color: Colors.black26)
                ),
                child: Text(header,style: TextStyle(color: Colors.white),),
              );
            },
            tableCellBuilder: (value) {
              return Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: Colors.grey)
                ),
                child: Text(value,textAlign: TextAlign.center,),
              );
            },
          ),
        ),
      );
    },
  )
                          
```

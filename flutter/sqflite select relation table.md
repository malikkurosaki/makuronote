```dart
try {
      final data = List.from(await Db.to.sql!.query(table)).map((e) => Map.from(e)).toList();

      for(final a in data){
        a['bill'] = List.from(await Db.to.sql!.query(ModelBill.table, where: 'listBillId = ?', whereArgs: [a['id']])).map((e) => Map.from(e)).toList();
        for(final c in a['bill']){
          c['product'] = List.from(await Db.to.sql!.query(ModelProduct.table, where: 'id = ?', whereArgs: [c['productId']])).map((e) => Map.from(e)).toList();
        }
      }

      print(JsonEncoder.withIndent(' ').convert(data));
     
    } catch (e) {
      print(e);
    }
 ```
 
 kuncinya ada di map.from()

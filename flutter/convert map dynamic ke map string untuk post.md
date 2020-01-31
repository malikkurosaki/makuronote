# conver map dynamic ke map String untuk post 

```dart
 _produkprovider.lsOkBill = _produkprovider.lsTableOrder.map((e) => new PojoOkBill(
            qty: int.parse(e.qty),
            note: e.note,
            nobill: nbill,
            harga_pro: int.parse(e.price),
            kode_pro: e.kode_pro,
            jamor: e.time,
            kD_WAITER: e.waiter,
            tanggal: _produkprovider.lsTimeNow[0].tanggal,
            kode_out: "RST",
            vts: "",
            vtax: 1.0,
            vser: 1,
            urut: 1,
            tax: 1,
            ser: 1,
            net: 1,
            gross: 1,
            disc_sen: 1,
            disc_nom: 1,
            cetak: 1
          )).toList();

          //Map<String,dynamic> data = _produkprovider.lsOkBill[0].toJson();

          var apa = _produkprovider.lsOkBill[0].toJson().map((key, value) => new MapEntry(key, "$value"??""));
          await http.post("${_produkprovider.urlTarget}/simpan-bill",body: apa,headers: RestApi.POST_HEADER,encoding: Encoding.getByName("utf-8")).then((value) => print(value.body.toString()));
          
          
```

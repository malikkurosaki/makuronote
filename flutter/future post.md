# feuture post mode

```dart
 Map<String,String> header =
    {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    };
Future<String> getNama()async{
    Map<String,String> data = {"nama":"malik"};
    var res = await new http.Client().post("$url/cari_nama",headers: header,body: data,encoding: Encoding.getByName("utf-8"));
    if(res.statusCode == 200){
      nama = res.body;
      return res.body;
    }else{
      print("gk 200 ok pengaturan");
    }
  }
```

# cara short list meja pojo

```dart
 List<PojoListMeja> lsMeja = json.decode(val).cast<Map<String,dynamic>>().map<PojoListMeja>((json)=>PojoListMeja.fromJson(json)).toList();
 lsMeja.sort((a,b)=>a.meja.length.compareTo(b.meja.length));
 ```

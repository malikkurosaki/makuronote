<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [cara short list meja pojo](#cara-short-list-meja-pojo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# cara short list meja pojo

```dart
 List<PojoListMeja> lsMeja = json.decode(val).cast<Map<String,dynamic>>().map<PojoListMeja>((json)=>PojoListMeja.fromJson(json)).toList();
 lsMeja.sort((a,b)=>a.meja.length.compareTo(b.meja.length));
 ```

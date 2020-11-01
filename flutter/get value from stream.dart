# get value from stream

```dart
  streamUser()async{
    final data = pengguna.snapshots(includeMetadataChanges: true);
    final apa = data.map((e) => e.docs.map((e) => e.data()).toList());

    await for (var ini in apa){
      this.user.value = UserModel.fromJson(ini[0]);
    }
    
  }
```

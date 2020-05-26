```dart
void _cariContact(BuildContext context,String val,ControllerCariContact cont)async{
    List<ModelUser> ls = cont.lsUser;
    final apa = ls.map((e){
      if(e.cName.toLowerCase().contains(val.toLowerCase())){
        e.terlihat = true;
      }else{
        e.terlihat = false;
      }
      return e;
    }).toList();
    cont.lsUser = apa;
  }
```

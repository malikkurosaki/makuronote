<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

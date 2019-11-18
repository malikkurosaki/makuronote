# flutter callback ++ 

```dart


import 'package:flutter/cupertino.dart';

class TheLayout extends StatelessWidget{

  int _berapa;

  final Function(int) berapaya;
  final VoidCallback onSiap;
  final Widget widget;

  TheLayout({Key key, this.berapaya, this.onSiap, this.widget}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return LayoutBuilder(
      builder: (context,constraint){

        if(constraint.maxWidth > 0 && constraint.maxWidth < 600){
          _berapa = 2;
          berapaya(_berapa);
        }else if (constraint.maxWidth > 600 && constraint.maxWidth < 768) {
          _berapa = 3;
          berapaya(_berapa);
        } else if (constraint.maxWidth > 768 && constraint.maxWidth < 992) {
          _berapa = 4;
          berapaya(_berapa);
        } else if (constraint.maxWidth > 992 && constraint.maxWidth < 1200) {
          _berapa = 5;
          berapaya(_berapa);
        } else{
          _berapa = 6;
          berapaya(_berapa);
        }

        onSiap();
        return  widget;
      },
    );
  }

}



```

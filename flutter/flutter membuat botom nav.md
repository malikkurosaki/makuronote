# flutter membuat botom nav 


```dart



import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LayoutBottomNav extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _LayoutBottomNav();
  }

}

class _LayoutBottomNav extends State<LayoutBottomNav> {

  int _indexNya = 0;

  void _onTab(int index){
    setState(() {
      _indexNya = index;
    });
  }

  @override
  Widget build(BuildContext context) {

    final _listPage = <Widget>[
      Text("ini halaman satu"),
      Text("ini halaman dua"),
      Text("ini j=halaman tiga")
    ];

    final _bottomNavItem = <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        title: Text("menu satu"),
        icon: Icon(Icons.home)
      ),
      BottomNavigationBarItem(
        title: Text("ini menu dua"),
        icon: Icon(Icons.account_balance_wallet)
      ),
      BottomNavigationBarItem(
        title: Text("ini menu tiga"),
        icon: Icon(Icons.print)
      )
    ];

    final _bottomNav = BottomNavigationBar(
      items: _bottomNavItem,
      onTap: _onTab,
      currentIndex: _indexNya,
    );
    return Scaffold(
      body: Center(
        child: _listPage[_indexNya],
      ),
      bottomNavigationBar: _bottomNav,
    );
  }
}


```

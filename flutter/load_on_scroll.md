# load on scroll

```dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:presto/views/detail_order.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:toast/toast.dart';

class OrderMenu extends StatelessWidget{
  final _scrl = ScrollController(
    initialScrollOffset: 0.0,
    keepScrollOffset: true
  );
  final _berapa = ValueNotifier<int>(20);
  final _kunci = GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    var angka = 20;
    return MultiProvider(
          providers: [
            FutureProvider(create: (context) => MenuProduct().getProduct(),),
          ],
          builder: (context, child) {
            final data = Provider.of<List<dynamic>>(context);
            final orderan = Provider.of<MenuDiorder>(context);

            _scrl.addListener(() { 
              if (_scrl.position.pixels == _scrl.position.maxScrollExtent) {
                angka += 5;
                if(data != null){
                  if(angka < data.length){
                    _berapa.value = angka;
                    Toast.show('load more menu ...', context);
                  }
                }
              }
            });
            return Scaffold(
              floatingActionButton: orderan.listMenu.length == 0?null:FloatingActionButton.extended(
                label: Chip(label: Text(orderan.listMenu.toSet().toList().length.toString()),),
                icon: Icon(Icons.shopping_cart),
                onPressed: () {
                  _kunci.currentState.showSnackBar(
                    SnackBar(
                      content: Container(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Flexible(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                    for(var i = 0;i< orderan.listMenu.length;i++)
                                    Container(
                                      child: ListTile(
                                        leading: Chip(label: Text("${i+1}"),),
                                        title: Text(orderan.listMenu[i]['nama_pro']),
                                        subtitle: Text(orderan.listMenu[i]['harga_pro'].toString()),
                                      ),
                                    )
                                ],
                              ),
                            ),
                            Chip(
                              label: IconButton(
                                icon: Icon(Icons.shopping_cart,color: Colors.cyan,),
                                onPressed: () {
                                  Navigator.push(context, MaterialPageRoute(builder: (context) => DetailOrder(),));
                                },
                              ),
                            )
                          ],
                        )
                      )
                    )
                  );
                },
              ),
              key: _kunci,
              body: SafeArea(
                child: SingleChildScrollView(
                  controller: _scrl,
                  child: Column(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('ORDER MENU',
                            style: TextStyle(
                              fontSize: 42
                            ),
                          ),
                          FutureBuilder(
                            future: getMeja(),
                            builder: (context, snapshot) => Row(
                              children: [
                                Text('MEJA : ',
                                  style: TextStyle(
                                    fontSize: 42
                                  ),
                                ),
                                Chip(
                                  backgroundColor: Colors.cyan,
                                  label: Text(snapshot.hasData?snapshot.data:"",
                                    style: TextStyle(
                                      fontSize: 42,
                                      color: Colors.white
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      
                      Container(
                        width: double.infinity,
                        alignment: Alignment.center,
                        child: data == null
                        ? Center(child: CircularProgressIndicator(),)
                        : ValueListenableBuilder(
                          valueListenable: _berapa,
                          builder: (context, value, child) => 
                            Wrap(
                            children: [
                              for(var i = data.length - value;i < data.length; i++)
                              Card(
                                child: Container(
                                  width: 200,
                                  height: 250,
                                  child: Column(
                                    children: [
                                      Flexible(
                                        child: Container(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      Container(
                                        alignment: Alignment.centerLeft,
                                        padding: EdgeInsets.all(8),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(data[i]['nama_pro'].toString().trim(),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            Text(data[i]['harga_pro'].toString().trim(),
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold
                                              ),
                                            ),
                                            
                                            Container(
                                              alignment: Alignment.bottomRight,
                                              child: FlatButton(
                                                color: Colors.cyan,
                                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                                onPressed: () async {
                                                  SharedPreferences prf = await SharedPreferences.getInstance();
                                                  data[i]['qty'] = 1;
                                                  data[i]['note'] = "";
                                                  data[i]['edit_note'] = false;
                                                  data[i]['jamor'] = new DateTime.now().toString().split(" ")[1].split(".")[0];
                                                  data[i]['jamor'] = new DateTime.now().toString().split(" ")[0];
                                                  data[i]['KD_WAITER'] = prf.getString('user');
                                                  await orderan.tambah(data[i]);
                                                  Toast.show('add to cart', context);
                                                }, 
                                                child: Text('ORDER',
                                                  style: TextStyle(
                                                    color: Colors.white
                                                  ),
                                                )
                                              ),
                                            )
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
  }

  Future<String> getMeja()async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    return prf.getString('meja');
  }

}

class MenuProduct {
  List<dynamic> _lsData;
  List get lsData => _lsData;

  setLsData(List value)async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    prf.setString('produk', jsonEncode(value).toString());
     _lsData = jsonDecode(prf.getString('produk'));
  }

  Future<List<dynamic>> getProduct() async {
    SharedPreferences prf = await SharedPreferences.getInstance();
    if(prf.getString('produk') == null){
      final res = await new Dio().get('http://' + prf.getString('host') + '/api/lihat-produk');
      prf.setString('produk', jsonEncode(res.data).toString());
    }
    print(prf.getString('produk'));
    return jsonDecode(prf.getString('produk').toString());
  }
}

class MenuDiorder extends ChangeNotifier{
  List<dynamic> _listMenu = [];
  List get listMenu => _listMenu;
  set listMenu(value) => _listMenu = value;

  MenuDiorder(){
    update();
  }

  setListMenu(List value)async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    prf.setString('orderan', jsonEncode(value).toString());
    _listMenu = jsonDecode(prf.getString('orderan'));
    notifyListeners();
  }
  
  tambah(value)async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    _listMenu.add(value);
    _listMenu = _listMenu.toSet().toList();
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    notifyListeners();
  }

  tambahQty(index) async{
    _listMenu[index]['qty'] = _listMenu[index]['qty'] == null? 1:_listMenu[index]['qty'];
    SharedPreferences prf = await SharedPreferences.getInstance();
    _listMenu[index]['qty'] += 1;
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    notifyListeners();
  }

  kurangiQty(index)async{
    _listMenu[index]['qty'] = _listMenu[index]['qty'] == null? 1:_listMenu[index]['qty'];
    SharedPreferences prf = await SharedPreferences.getInstance();
    _listMenu[index]['qty'] -= 1;
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    if(_listMenu[index]['qty'] < 1){
        hapusItem(index);
    }
    notifyListeners();
  }

  hapusItem(index)async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    _listMenu.removeAt(index);
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    notifyListeners();
  }

  editNote(index)async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    _listMenu[index]['edit_note'] =  !_listMenu[index]['edit_note'];
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    notifyListeners();
  }

  tambahNote(index,value)async{
    _listMenu[index]['note'] = value;
    SharedPreferences prf = await SharedPreferences.getInstance();
    prf.setString('orderan', jsonEncode(_listMenu).toString());
    notifyListeners();
  }

  update()async{
    SharedPreferences prf = await SharedPreferences.getInstance();
    setListMenu(jsonDecode(prf.getString('orderan')));
    notifyListeners();
  }
}

```

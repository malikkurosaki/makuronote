# dedpendency get 

### penjelasan singkat 

```dart
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get_state_manager/get_state_manager.dart';
import 'package:get/route_manager.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main()async{
  initServices();
  runApp(
    GetMaterialApp(
      enableLog: true,
      unknownRoute: GetPage(name: '/404', page: () => GakTau()),
      initialRoute: '/',
      getPages: [
        GetPage(
          name: '/', 
          page: () => Home(),
          binding: BindingsBuilder(
            () => {
              Get.putAsync<SharedPreferences>(() async => await SharedPreferences.getInstance())
            }
          ),
          transition: Transition.zoom
        ),
        GetPage(
          name: '/hal2/:nama', 
          page: () => HalamanKedua(),
          transition: Transition.zoom
        )
      ],
    )
  );
}

void initServices()async{
  await Get.putAsync(() => Prf().init());
}

class Prf extends GetxService{
  Future<SharedPreferences> init () async => SharedPreferences.getInstance();
}


class GakTau extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
          body: Container(
        child: Center(child: Text('404'),),
      ),
    );
  }
}

class Home extends StatelessWidget{

  final _myController = Get.put(MyController());
  SharedPreferences prf = Get.find();
  @override
  Widget build(BuildContext context) {
    print("iam in home");
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            Obx(() => Text(_myController.count.toString())),
            FlatButton(
              onPressed: ()async{
                prf.setString("nama", "malik kah");
              }, 
              child: Text(prf.getString("nama")??"siapa")
            ),
            FlatButton(
              onPressed: (){
                 Get.bottomSheet(
                  Container(
                    color: Colors.white,
                    child: Wrap(
                      children: <Widget>[
                        ListTile(
                          leading: Icon(Icons.music_note),
                          title: Text('Music'),
                          onTap: () => {}
                        ),
                        ListTile(
                          leading: Icon(Icons.videocam),
                          title: Text('Video'),
                          onTap: () => {},
                        ),
                      ],
                    ),
                  )
                );
              }, 
              child: Text('pindah'.tr)
            ),
            Text('pindah'.tr)
          ],
        ),
      ),
    );
  }

}



class MyController extends GetxController{
  var count = 0.obs;
  increment() => count++;
}

class HalamanKedua extends StatelessWidget{
  final MyController _con  = Get.find();
  @override
  Widget build(BuildContext context) {
    print('iam in halaman kedua');
    return Scaffold(
        body: Center(
          child: Column(
            children: [
              Text(_con.count.toString()),
              Text(Get.parameters['nama'].toString()??"nama")
            ],
          ),
        ),
      );
  }

}

```

```dart
import 'dart:core';

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:probus_mobile/main.dart';
import 'package:probus_mobile/models_phis/model_fore_cast_occupancy.dart';
import 'package:probus_mobile/models_phis/model_hotel_home.dart';
import 'package:probus_mobile/rest_api.dart';
import 'package:probus_mobile/views/home.dart';
import 'package:probus_mobile/tema.dart';

class HotelHome extends Abs<ModelHotelHome>{
  static final load = false.obs;
  static final modelData = ModelHotelHome().obs;

  @override
  Widget build(BuildContext context) => buat(
    onFinis: () => Text(modelData?.toJson()?.toString()??"ini sia")
  );

  @override
  RxBool get loading => load;

  @override
  Future get restApi => RestApi.home();

  @override
  datanya(Map<String, dynamic> theData) {
    modelData.value = ModelHotelHome.fromJson(theData);

    final a = List.filled(4, "apa");
    final b = {"satu":"dua"};
    print(a is List);
    print(b is Map);
  }
  
}


typedef OnFinis = Widget Function();
abstract class Abs<T> extends StatelessWidget{

  RxBool get loading;
  Future get restApi;
  void datanya(Map<String, dynamic> theData);
  
  Widget buat({@required OnFinis onFinis }) =>
  FutureBuilder(
    future: init(),
    builder: (context, snapshot) => 
    snapshot.connectionState != ConnectionState.done?
    Text("loading .."):Obx(
      () => loading.value?
      Text("wait ..."): onFinis()
    ),
  );

  init()async{
    loading.value = true;
    await getData();
    loading.value = false;
  }

  getData()async{
    print("load data");
    try {
      final data = await restApi;
      datanya(data);
    } catch (e) {
      print(e.toString());
    }
  }
  
}


```

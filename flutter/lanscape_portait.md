# flutter lanscape poertrait

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:presto_qr/migrasi1/m1_profile/m1_profile_member_card.dart';

class M1ProfileZoomBarcode extends StatelessWidget {

  @override
  Widget build(BuildContext context) =>
  WillPopScope(
    onWillPop: onWillPop,
    child: Scaffold(
      body: FutureBuilder(
        future: onLoad(),
        builder: (context, snapshot) => 
        snapshot.connectionState != ConnectionState.done
        ? Center(
          child: CircularProgressIndicator(),
        ): M1ProfileMemberCard()
      )
    ),
  );

  onLoad()async{
    final ori = MediaQuery.of(Get.context).orientation;
    if(ori.index == 0) SystemChrome.setPreferredOrientations([DeviceOrientation.landscapeRight]);
    
  }

  Future<bool> onWillPop()async{
    final ori = MediaQuery.of(Get.context).orientation;
    if(ori.index == 1) SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    return true;
  }
}

```

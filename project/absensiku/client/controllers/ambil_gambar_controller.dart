

import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker_cross/file_picker_cross.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_state_manager/src/simple/get_state.dart';

import '../rest_api.dart';

class AmbilGambarController extends GetxController{
  static AmbilGambarController get to => Get.find();

  final image = Uint8List(0).obs;

  Future mengambilGambar()async{
    
    FilePickerCross myFile = await FilePickerCross.importFromStorage(
      type: FileTypeCross.image
    );
    //print(myFile.fileName);

    
    List<int> gambar = myFile.toUint8List();


    //this.image.value = gambar;

    final form = FormData(
      {
        "user_id": "1",
        "name": myFile.fileName,
        "file": MultipartFile(gambar, filename: "gambar", contentType: "multipart/form-data")
      }
    );

    Response res = await RestApi().apiSimpanGamabar(form);
    print(res.body['data']);
  }
}
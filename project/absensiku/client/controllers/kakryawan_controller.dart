import 'package:catatanku/rest_api.dart';
import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';

class KaryawanController extends GetxController{
  static KaryawanController get to => Get.find();


  final kunciForm = GlobalKey<FormState>();
  final field = ["name", "email", "password"].obs;
  var controller = List.generate(3, (x) => TextEditingController()).obs;

  Future menambahKaryawan() async {
    if(!kunciForm.currentState.validate()){
      Get.snackbar("info", "isi semuanya");
      return;
    }

    final paket = {
      "name": this.controller[0].value.text,
      "email": this.controller[1].value.text,
      "password": this.controller[2].value.text,
    };

    Response res = await RestApi().apimendaftar(paket);
    
    if(!res.body['status']){
      Get.snackbar("info", "gagal mendaftar");
      return;
    }
    Get.snackbar("info", this.controller[0].value.text+" berhasil didaftarkan");
    kunciForm.currentState.reset();
  }
}
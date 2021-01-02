import 'package:get/get.dart';

class HalamanController extends GetxController{
  static HalamanController get to => Get.find();
  final index = 0.obs;

  void setIndex(value){
    this.index.value = value;
    Get.back();

    
  }
}
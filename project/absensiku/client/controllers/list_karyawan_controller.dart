import 'package:catatanku/rest_api.dart';
import 'package:get/get_state_manager/get_state_manager.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class ListKaryawanController extends GetxController{
  static ListKaryawanController get to => Get.find();

  final listKaryawan = [].obs;


  Future getListKaryawan()async{
    // if(GetStorage().hasData('list_karyawan')){
    //   this.listKaryawan.assignAll(GetStorage().read("list_karyawan"));
    // }
    print("ambil list karyawan");
    Response res = await RestApi().apiLihatKaryawan();
    if(res.body['status']) this.listKaryawan.assignAll(res.body['data']);
    //GetStorage().listenKey("list_karyawan", (val) => this.listKaryawan.assignAll(GetStorage().read("list_karyawan")));
    
  }
}
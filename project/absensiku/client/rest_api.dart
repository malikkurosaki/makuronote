

import 'package:get/get_connect/connect.dart';

class RestApi extends GetConnect{
  // static String host = "http://localhost:8000/api";
  static String host = "http://192.168.43.112:8000/api";

  Future apimendaftar(value) async => await post("$host/simpan-karyawan", value); 
  Future apiLihatKaryawan() async => await get("$host/lihat-karyawan");
  Future<Response> apiSimpanGamabar(var form)async => await post("$host/simpan-gambar", form);

  Future apiLihatGambar() => get("$host/lihat-gambar/1/gambar.png");
}
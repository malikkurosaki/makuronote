import 'package:catatanku/components/ambil_gambar.dart';
import 'package:catatanku/components/form_tambah_karyawan.dart';
import 'package:catatanku/components/list_karyawan.dart';
import 'package:catatanku/controllers/ambil_gambar_controller.dart';
import 'package:catatanku/controllers/halaman_controller.dart';
import 'package:catatanku/controllers/kakryawan_controller.dart';
import 'package:catatanku/controllers/list_karyawan_controller.dart';
import 'package:catatanku/views/halaman_satu.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

void main() async{
  initServices();
  await GetStorage.init();
  runApp(MyApp());
}

void initServices(){
  Get.put(HalamanController());
  Get.put(KaryawanController());
  Get.put(ListKaryawanController());
  Get.put(AmbilGambarController());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
          constraints: BoxConstraints(
            maxWidth: 640
          ),
          child: GetMaterialApp(
          initialBinding: MyBinding(),
          debugShowCheckedModeBanner: false,
          initialRoute: '/',
          getPages: [
            GetPage(name: '/', page: () => RootView())
          ],
        ),
      ),
    );
  }
}


class MyBinding extends Bindings{
  @override
  void dependencies() {
    Get.put<HalamanController>(HalamanController());
    Get.put<KaryawanController>(KaryawanController());
    Get.put<ListKaryawanController>(ListKaryawanController());
    Get.put<AmbilGambar>(AmbilGambar());
  }

}

class RootView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        appBar: AppBar(),
        drawer: MyDrawer(),
        body: Container(
          child: GetX(
            builder: (controller) => IndexedStack(
              index: HalamanController.to.index.value,
              children: [
                HalamanSatu(),
                ListKaryawan()
              ],
            ),
          )
        )
      ),
    );
  }
}

class MyDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blueGrey
            ),
            child: Text("ini adalah Drawer")
          ),
          ListTile(
            title: Text("halaman 1"),
            onTap: () => HalamanController.to.setIndex(0),
          ),
          ListTile(
            title: Text("halaman 2"),
            onTap: () => HalamanController.to.setIndex(1)
          )
        ],
      ),
    );
  }
}


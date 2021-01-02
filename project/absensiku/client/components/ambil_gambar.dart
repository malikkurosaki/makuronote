import 'package:catatanku/controllers/ambil_gambar_controller.dart';
import 'package:catatanku/rest_api.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get_state_manager/src/rx_flutter/rx_obx_widget.dart';

class AmbilGambar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Image.network(RestApi.host+"/lihat-gambar/1/i9aa0k8-IMG_20201219_093411.jpg"),
        Container(
          child: FlatButton(
            child: Text("ambil gambar"),
            onPressed: () => AmbilGambarController.to.mengambilGambar(),
          ),
        ),
      ],
    );
  }
}
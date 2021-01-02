import 'package:catatanku/controllers/list_karyawan_controller.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get_state_manager/src/rx_flutter/rx_getx_widget.dart';
import 'package:get/get.dart';


class ListKaryawan extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("List Karyawan",
              style: TextStyle(
                fontWeight: FontWeight.bold
              ),
            ),
            GetX(
              initState: (state) async => await ListKaryawanController.to.getListKaryawan(),
              builder: (controller) => Column(
                children: [
                  for(var i = 0; i < ListKaryawanController.to.listKaryawan.length; i++)
                  ListTile(
                    leading: CircleAvatar(
                      child: Text(ListKaryawanController.to.listKaryawan[i]['name'].toString().substring(0,1)),
                    ),
                    title: Row(
                      children: [
                        Icon(Icons.people),
                        Expanded(
                          child: Text(ListKaryawanController.to.listKaryawan[i]['name'].toString())
                        ),
                        IconButton(
                          icon: Icon(Icons.more_vert), 
                          onPressed: (){
                            Get.bottomSheet(
                              BottomSheet(
                                onClosing: (){}, 
                                builder: (context) => Card(
                                  child: Container(
                                    padding: EdgeInsets.all(8),
                                    child: Text("hapus?"),
                                  ),
                                ),
                              )
                            );
                          }
                        )
                      ],
                    ),
                    subtitle: Row(
                      children: [
                        Icon(Icons.email),
                        Text(ListKaryawanController.to.listKaryawan[i]['email'].toString()),
                      ],
                    ),
                    dense: true,
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
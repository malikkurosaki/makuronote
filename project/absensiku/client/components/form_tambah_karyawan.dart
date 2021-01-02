import 'package:catatanku/controllers/kakryawan_controller.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class FormTambahKaryawan extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Card(
        child: Container(
          padding: EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                child: Text("Dafatarkan Karyawan")
              ),
              Form(
                key: KaryawanController.to.kunciForm,
                child: Column(
                  children: [
                    for(var x = 0; x < KaryawanController.to.field.length; x++)
                    Container(
                      margin: EdgeInsets.only(bottom: 4),
                      child: TextFormField(
                        validator: (value) => value.isEmpty?"no empty":null,
                        controller: KaryawanController.to.controller[x],
                        decoration: InputDecoration(
                          labelText: KaryawanController.to.field[x]
                        ),
                      ),
                    )
                  ],
                )
              ),
              FlatButton(
                color: Colors.blue,
                minWidth: double.infinity,
                onPressed: () => KaryawanController.to.menambahKaryawan(), 
                child: Text('SIMPAN')
              )
            ],
          ),
        ),
      ),
    );
  }
}

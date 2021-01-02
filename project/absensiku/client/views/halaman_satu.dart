import 'package:catatanku/components/ambil_gambar.dart';
import 'package:catatanku/components/form_tambah_karyawan.dart';
import 'package:catatanku/components/list_karyawan.dart';
import 'package:flutter/cupertino.dart';

class HalamanSatu extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: SingleChildScrollView(
        child: Column(
          children: [
            FormTambahKaryawan(),
            AmbilGambar()
          ],
        ),
      ),
    );
  }
}
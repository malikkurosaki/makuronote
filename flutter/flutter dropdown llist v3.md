# dropdown list v3

```dart


class NamaRestaurant extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return new _NamaRestaurant();
  }

}

class _NamaRestaurant extends State<NamaRestaurant> {
  NamaOutlet _namaOutlet;
  String _nam = "satu";
  int nam = null;
  List<NamaOutlet> _namaNe;

  final String uri = "https://purimas.probussystem.com:4450/api/getOutlets";

  Future<List<NamaOutlet>> _mendapatkanNamaOutlet() async {
    var response = await http.get(uri);
    if (response.statusCode == 200) {
      final item = json.decode(response.body).cast<Map<String, dynamic>>();
      List<NamaOutlet> listNama = item.map<NamaOutlet>((json) {
        return NamaOutlet.fromJson(json);
      }).toList();
      return listNama;
    } else {
      throw Exception("gagal mendapatkan nama outlet");
    }
  }

  @override
  Widget build(BuildContext context) {
    NamaOutlet namaOutlet;
    return FutureBuilder(
        future: _mendapatkanNamaOutlet(),
        builder: (BuildContext context,
            AsyncSnapshot<List<NamaOutlet>> snapshot) {
          if (!snapshot.hasData) return CircularProgressIndicator();
          return DropdownButton(
            items: snapshot.data.map((nama)=>DropdownMenuItem<NamaOutlet>(
              child: Text(nama.nama_out),
              value: nama,
            )).toList(),
            onChanged: (nama){
              setState(() {
                namaOutlet = nama;
              });
            },
            value: namaOutlet,
            hint: Text("pilih outlet"),
          );
        });
    }

}

```

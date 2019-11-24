# flutter date picker

```dart
class PegawaiBaru extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PegawaiBaru();
  }

}

class _PegawaiBaru extends State<PegawaiBaru> {

  var keterangan = [
    "nama",
    "umur",
    "tanggal masuk",
    "jabatan",
    "jenis kelamin"
  ];

  List<dynamic> nama = [
    TextEditingController(),
    TextEditingController(),
    TextEditingController(),
    TextEditingController(),
    TextEditingController(),
  ];


  DateTime selectedDate = DateTime.now();

  Future<Null> _selectDate(BuildContext context) async {
    final DateTime picked = await showDatePicker(
        context: context,
        initialDate: selectedDate,
        firstDate: DateTime(2015, 8),
        lastDate: DateTime(2101));
    if (picked != null && picked != selectedDate)
      setState(() {
        selectedDate = picked;
      });
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Container(
      padding: EdgeInsets.all(8),
      child: Column(
        children: <Widget>[
          Column(
            children: List.generate(keterangan.length, (x)=>Container(
              padding: EdgeInsets.all(8),
              child: TextField(
                controller: nama[x],
                decoration: InputDecoration(
                  border: InputBorder.none,
                  labelText: keterangan[x],
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Colors.blue
                    )
                  )
                ),
                onTap: (){
                  if (x == 2) {
                    _selectDate(context).then((val){
                      print(selectedDate);
                    });
                  }
                },
              ),
            )),
          ),
          Container(
            width: double.infinity,
            margin: EdgeInsets.symmetric(horizontal: 8),
            color: Colors.blueGrey,
            child: FlatButton(
              child: Text("simpan"),
              onPressed: (){

              },
            ),
          )
        ],
      ),
    );
  }
}

```

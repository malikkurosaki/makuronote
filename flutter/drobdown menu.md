# drobdown menu

```dart
class Kotak extends StatefulWidget{
  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _Kotak();
  }

}

class _Kotak extends State<Kotak> {
  String _value;
  @override
  Widget build(BuildContext context) {

    return DropdownButton<String>(
      items: [
        DropdownMenuItem<String>(
          child: Text('Item 1'),
          value: 'one',
        ),
        DropdownMenuItem<String>(
          child: Text('Item 2'),
          value: 'two',
        ),
        DropdownMenuItem<String>(
          child: Text('Item 3'),
          value: 'three',
        ),
      ],
      onChanged: (String value) {
        setState(() {
          _value = value;
        });
      },
      hint: Text('Select Item'),
      value: _value,
    ) ;
  }
}




```

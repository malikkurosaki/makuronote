# solusi klick di listviw

```dart
// you can do that by using `Map` but for simplicity I used 2 separate `List`. 
List<int> _list = List.generate(20, (i) => i);
List<bool> _selected = List.generate(20, (i) => false); // initially fill it up with false

Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(),
    body: ListView.builder(
      itemBuilder: (_, i) {
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 2),
          color: _selected[i] ? Colors.blue : null, // if current item is selected show blue color
          child: ListTile(
            title: Text("Item ${_list[i]}"),
            onTap: () => setState(() => _selected[i] = !_selected[i]), // reverse bool value
          ),
        );
      },
    ),
  );
  
```

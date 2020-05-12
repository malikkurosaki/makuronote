# radio button 

```dart
// pilihan kiriman
  Widget pilihKiriman(){
    ValueNotifier _val = ValueNotifier<int>(0);
    
    return Container(
      child: ValueListenableBuilder(
        valueListenable: _val,
        builder: (context, value, child) {
          

          return Row(
            children: [
              Radio(
                groupValue: value,
                value:0,
                onChanged: (value) {
                  _val.value = value;
                },
              ),
              Radio(
                groupValue: value,
                value: 1,
                onChanged: (value) {
                   _val.value = value;
                },
              )
            ],
          );
        },
      ),
    );
  }
 ```

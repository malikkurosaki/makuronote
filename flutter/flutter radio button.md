<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [radio button](#radio-button)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

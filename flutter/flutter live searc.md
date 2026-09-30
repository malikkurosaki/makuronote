<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter live search](#flutter-live-search)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter live search 

```dart 
List<DropdownMenuItem> items = [];
String selectedValue;

Widget widget() {
  for(int i=0; i < 20; i++){
    items.add(new DropdownMenuItem(
      child: new Text(
        'test ' + i.toString(),
      ),
      value: 'test ' + i.toString(),
    ));
  }

  return new SearchableDropdown(
     items: items,
     value: selectedValue,
     hint: new Text(
       'Select One'
     ),
     searchHint: new Text(
       'Select One',
       style: new TextStyle(
           fontSize: 20
       ),
     ),
     onChanged: (value) {
       setState(() {
         selectedValue = value;
       });
     },
   );
}
```

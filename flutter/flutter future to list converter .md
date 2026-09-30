<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [mengambil data sari future  dan merubahnya kedalam list](#mengambil-data-sari-future--dan-merubahnya-kedalam-list)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mengambil data sari future  dan merubahnya kedalam list

```dart
@override
  void initState() {
    // TODO: implement initState
    super.initState();
    fSTrafic = getSalesTrafic(cSTrafic);

    getSalesTrafic(cSTrafic).then((data){
        lCSTrafic = List<PojoCSalesTrafic>.generate(data.length, (index){
          return new PojoCSalesTrafic(data[index].date, data[index].value, Colors.primaries[Random().nextInt(Colors.primaries.length)]);
        }).toList();
    });

  }

```

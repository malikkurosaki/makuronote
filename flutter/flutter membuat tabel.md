<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [mmbuat tabel](#mmbuat-tabel)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mmbuat tabel


```dart

SingleChildScrollView(
  scrollDirection: Axis.horizontal,
  child: DataTable(
      columns: [
        DataColumn(label: Text("ini satu")),
        DataColumn(label: Text("ini adalah dua")),
        DataColumn(label: Text("ini satu")),
        DataColumn(label: Text("ini adalah dua")),
        DataColumn(label: Text("ini satu")),
        DataColumn(label: Text("ini adalah dua")),

      ],
      rows: [
        DataRow(
            cells: [
              DataCell(Text("ooooo")),
              DataCell(Text("eeeeeeee")),
              DataCell(Text("ooooo")),
              DataCell(Text("eeeeeeee")),
              DataCell(Text("ooooo")),
              DataCell(Text("eeeeeeee"))
            ]
        )
      ]
  ),
)
              
              
```

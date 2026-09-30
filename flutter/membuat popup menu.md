<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [membuat popupmenu flutter](#membuat-popupmenu-flutter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# membuat popupmenu flutter

```dart


enum MENUNYA {satu ,dua,tiga,empat,lima}


class _MyApp extends State<MyApp> {


  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: Container(
          child: SafeArea(
            child: Container(
              child: PopupMenuButton(
                onSelected: (v){

                },
                itemBuilder: (_)=><PopupMenuEntry<MENUNYA>>[
                  PopupMenuItem<MENUNYA>(
                    value: MENUNYA.satu,
                    child: Text("tekan"),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

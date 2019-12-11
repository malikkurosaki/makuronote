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

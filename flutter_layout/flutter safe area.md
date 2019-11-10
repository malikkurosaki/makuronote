# Fluter Widget


### Daftar isi

- flutter safe area
  - karena gk semua hp adalah kotak , safe area untuk mengatasi layar hanphome yangmelengkung dan berponi
  
 ```java
       void main() => runApp(MyApp());

    class MyApp extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
        // TODO: implement build
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: "tutorial flutter",
          home: Scaffold(
            body: Align(
              alignment: Alignment.topLeft,
              child: SafeArea(
                child:  Text("ini adalah safe area"),
              ),
            ),
          ),
        );
      }
    }
```

- flutter expanded
  - layout untuk mengisi ruang kosong antara layout

  
- flutter warap
- animated container
- opacity
- future builder
- fade transition
- floating action button fab
- page view
- table
- sliver app bar
- fade in image
- stream builder
- inherited model
- cliprrect
- hero
- custom paint
- tooltips
- fittedbox
- layout builder
- absor pointer
- transform
- backdrop filter
- Align
- Positioned
- Animated Builder
- Dismissible
- sizedbox
- valuelistenablelistenre
- dragable
- alimated list 
- flexible
- media query
- spacer
- inherited widget
- animated icon
- Aspect rasio
- Limited box
- place Holder
- Rich Text
- ReorderableListView
- AnimatedSwicher
- AnimatedPositioned
- AnimatedPadding
- IndexedStack
- Sematic
- ConstraintBox
- Stack
- AnimatedOpacity
- FragtionalySizeBox
- ListView
- ListTile
- Container
- SelectableText
- Data Table
- Slider

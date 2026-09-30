<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```dart
Padding(
            padding: const EdgeInsets.all(60),
            child: RawKeyboardListener(
              focusNode: _fokusTitle,
              child: Text("halo"),
              onKey: (x) async {
                if (x.isControlPressed && x.character == "v" || x.isMetaPressed && x.character == "v") {
                  final imageBytes = await Pasteboard.image;
                  print(imageBytes?.length);
                }
              },
            ),
          )
```



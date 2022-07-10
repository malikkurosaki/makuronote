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



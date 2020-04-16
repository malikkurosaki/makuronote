# popup menu

```dart
PopupMenuButton(
  itemBuilder: (context) => <PopupMenuItem<String>>[
    PopupMenuItem(
      child: Row(
        children: [
          Icon(Icons.exit_to_app,color: Colors.black,),
          Text("logout".toUpperCase())
        ],
      ),
    )
  ],
),
```

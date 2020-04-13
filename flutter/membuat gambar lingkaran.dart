# membuat gambar lingkran

```dart
return Container(
  width: 30,
  height: 30,
  decoration: BoxDecoration(
    shape: BoxShape.circle,
    image: DecorationImage(
      fit: BoxFit.cover,
      image: imageProvider
    )
  ),
);
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [ganti icon laucher](#ganti-icon-laucher)
    - [setingan pubspec yaml](#setingan-pubspec-yaml)
    - [jalankan diterminal](#jalankan-diterminal)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ganti icon laucher 


### setingan pubspec yaml

```yaml
dev_dependencies: 
  flutter_launcher_icons: "^0.7.3"
  
flutter_icons:
  android: "launcher_icon" 
  ios: true
  image_path: "assets/icon/icon.png"
```


### jalankan diterminal

```terminal
flutter pub get
flutter pub run flutter_launcher_icons:main
```

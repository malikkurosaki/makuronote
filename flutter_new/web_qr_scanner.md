<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [flutter web scanner](#flutter-web-scanner)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutter web scanner 
  
  
pubspec.yaml
```yaml
ai_barcode: ^3.0.1
```
  
index.js
```html
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js"></script>
```

barcode.dart
```dart
Container(
  color: Colors.black26,
  width: cameraWidth,
  height: cameraHeight,
  child: PlatformAiBarcodeScannerWidget(
    platformScannerController: _scannerController,
  ),
),
```

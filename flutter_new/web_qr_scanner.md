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

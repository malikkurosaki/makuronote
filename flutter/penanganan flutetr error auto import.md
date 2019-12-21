# penanganan auto import error di flutter

```bash
The thing with pubspec.yaml is that you have to save it CRTL/CMD + S before pub get will work. Running pub get from IDE doesn't save the file automatically.

Try running flutter clean and then run flutter pub get. Sometimes when you remove dependencies like plugins, .build folder doesnt get cleaned up properly so you have to do it manually.

You can try to repair pub cache by running pub cache repair

Sometimes just restarting your IDE might solve the problem as well.

```

### cara kedua

```bash
- flutter clean 
- rm -rf pubspec.lock .packages .flutter-plugins 
- flutter pub pub cache repair
- flutter packages get 
```

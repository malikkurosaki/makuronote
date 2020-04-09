# flutterdebug key 

mac
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

windows
```bash
keytool -list -v -keystore "\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

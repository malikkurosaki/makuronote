<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [flutterdebug key](#flutterdebug-key)
- [contoh mac dan linux](#contoh-mac-dan-linux)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# flutterdebug key 

mac
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

windows
```bash
keytool -list -v -keystore "\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android


```

# contoh mac dan linux

```bash
keytool -list -v -keystore malikkurosaki.jks -alias malikkurosaki -storepass **** -keypass ******
```

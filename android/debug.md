# debug key 


debug 

```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

release

```
keytool -list -v -keystore {keystore_name} -alias {alias_name}

keytool -list -v -keystore C:\Users\MG\Desktop\test.jks -alias test
```

# cek koneksi internet 


```gradel
// network manager
    implementation 'com.github.jumadeveloper:networkmanager:0.0.2'
```


```java
Tovuti.from(this).monitor((connectionType, isConnected, isFast) -> {
            if (isConnected){
                Toast.makeText(getApplicationContext(),"connected "+connectionType,Toast.LENGTH_LONG).show();
            }else {
                Toast.makeText(getApplicationContext(),"gak ada koneksi",Toast.LENGTH_LONG).show();
            }
        });
        
```


```java
 @Override
    protected void onStop() {
        Tovuti.from(this).stop();
        super.onStop();
    }
```



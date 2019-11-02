# mendapatkan support fragment dari static class

```java
 public static void cekOffline(Context context, View view){
        Activity activity = (Activity)context;

        Tovuti.from(context).monitor((connectionType, isConnected, isFast) -> {
            if (!isConnected){
                ((FragmentActivity)activity).getSupportFragmentManager().beginTransaction().replace(view.getId(),new HalamanOffline()).commitAllowingStateLoss();
            }
        });
    }
    
```

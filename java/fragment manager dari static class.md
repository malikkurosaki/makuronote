<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [mendapatkan support fragment dari static class](#mendapatkan-support-fragment-dari-static-class)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [tekan lagi untuk kembali](#tekan-lagi-untuk-kembali)
    - [deklarasinya](#deklarasinya)
    - [di backpressnya](#di-backpressnya)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

 # tekan lagi untuk kembali
 
 
 ### deklarasinya
 
 ```java
 keluar = Toast.makeText(getApplicationContext(), "Press back again to exit", Toast.LENGTH_SHORT);
 ```
 
 ### di backpressnya
 ```java
  @Override
    public void onBackPressed() {
        if (keluar.getView().isShown()) {
            keluar.cancel();
            super.onBackPressed();
        } else {
            keluar.show();
        }    
    }
 ```
 
 

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
 
 

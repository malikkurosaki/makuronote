# validasi peringatan formkosong 

```javascript
 $('#simpan').click(()=>{
        var nd = $('.tambah-anggota');
        for(var i = 0;i<nd.length;i++){
            if(nd[i].value == ""){
                nd[i].classList.add('bg-danger');
            }else{
                if(nd[i].classList.contains('bg-danger')){
                    nd[i].classList.remove('bg-danger')
                }
            }
        }
        
    });
```

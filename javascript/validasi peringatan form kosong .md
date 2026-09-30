<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [validasi peringatan formkosong](#validasi-peringatan-formkosong)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

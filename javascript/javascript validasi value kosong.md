<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [validasi value kosong](#validasi-value-kosong)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# validasi value kosong

```js

let pendaftaran = () => {
    $('#daftar').click(() => {
        let cek = $('.daftar');
        for(c of cek){
            if(c.value === ""){
                $(c).addClass('bg-danger');
                return;
            }else{
                if($(c).hasClass('bg-danger')){
                    $(c).removeClass('bg-danger');
                }
            }
        }
    })
}

```

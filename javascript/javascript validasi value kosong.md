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

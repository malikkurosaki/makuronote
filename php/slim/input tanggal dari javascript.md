# input tanggal dari javascript

```js
const paketan = {
            "id":$('#idnya').html(),
            "judul":$('#judul').val(),
            "kategori":$('#kategori').val(),
            "isi":mde.value(),
            "tanggal":new Date().toISOString().slice(0, 19).replace('T', ' '),
            "keterangan":$('#keterangan').val(),
            "gambar":$('#gambar').val()
        }
```

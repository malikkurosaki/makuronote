<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [input tanggal dari javascript](#input-tanggal-dari-javascript)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

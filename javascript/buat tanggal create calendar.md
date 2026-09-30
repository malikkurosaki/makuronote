<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [buat tanggalan create calendar basic](#buat-tanggalan-create-calendar-basic)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# buat tanggalan create calendar basic

```js
let year = new Date().getFullYear()
let month = 0

const minggu = (new Date(year, month)).getDay();
const totalHari = new Date(year, month + 1, 0).getDate();
let date = 1;
let hasil = [];

for(let j = 0; j < 6; j++) {
    hasil[j] = [];
    for(let i = 0; i < 7 ; i++) {
        let textNode;
        if(j === 0 && i < minggu) {
            textNode = "x";
        } else if(totalHari >= date) {
            textNode = date;
            date++;
        }
        else break;
        hasil[j].push(textNode);
    }
}


console.log(hasil)
```

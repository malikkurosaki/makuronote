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

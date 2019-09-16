# looping number with zero lead

_pengulangan nomer dengan angka nol didepan_

```js
   
        var disini = document.getElementById("disini");
        var jadinya = ""
        for(var i =0000 ;i< 47;i++){
            jadinya +=`<xmp><item android:drawable="baru/pb${("00000"+i).slice(-4)}.png" android:duration="50"/></xmp>`
        }
        disini.innerHTML = jadinya
```

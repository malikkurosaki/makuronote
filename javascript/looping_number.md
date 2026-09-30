<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [looping number with zero lead](#looping-number-with-zero-lead)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

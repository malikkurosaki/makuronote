# jalankan sxcript saat enterr

```javascript
// route get
function lihat(e,event){
    var routeApa = "";
    var x = event.which || event.keycode
    if(x === 13){
        $.get(`/${e.id}`,(a,b)=>{
            routeApa += `<div class="w3-container w3-black  w3-padding w3-large">Route /${e.id}<br> <hr></div>`
            routeApa += `<pre style="overflow:scroll" class="w3-small container"><div class="w3-padding">${JSON.stringify(a,undefined, 2)}</div></pre>`
            $("#lihat").html(routeApa)
        })
    }

}
```

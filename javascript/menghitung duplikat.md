```javascript
 function kembar(){
            var bahan = $('#dup').val().split("").filter(e =>e.match(/[a-zA-Z]/))
            var counts = {};
            bahan.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

            var b = Object.keys(counts)
            var a = Object.values(counts)

            var hasil = ''
            for (var i in b){
                hasil += `${b[i]} : ${a[i]} <br>`
            }
            $('#hasil2').html(hasil)
           
} 
```

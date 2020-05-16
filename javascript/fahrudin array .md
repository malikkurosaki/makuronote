```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div >
        <p>kata dalam kalimat</p>
        <input id="kata" type="text" placeholder="masukkan kata" onkeyup="berapa()">
        <div id="hasil"></div>
    </div>
    <div >
        <p>temukan duplikat</p>
        <input id="dup" type="text" placeholder=" masukkan kata" onkeyup="kembar()">
        <div id="hasil2"></div>
    </div>
    


    <script>
        function berapa(){
            var pros = $('#kata').val().split(' ');
            var bukan = pros.filter(e => e.match(/^[^a-zA-Z]+$/))
            var iya = pros.filter(e => e.match(/[a-zA-Z]+$/))
            var hasil = `${iya.length}/${bukan.length + pros.length-1}`
            $('#hasil').html(hasil)
        }

        function kembar(){
            var nil = $('#dup').val().split("")
            var hasil = []
            var cur = null;
            var cot = 0;
            var ini = {}
            nil = nil.filter(e =>e.match(/[a-zA-Z]+$/))
            for(var i = 0;i<nil.length;i++){
                
                if(nil[i] != cur){
                    if(cot > 0){
                       ini[nil[i]] = `${cur} : ${cot}`
                    }
                    cur = nil[i]
                    cot =1;
                }else{
                    cot++;
                }
                if(cot > 0){
                    ini[nil[i]] = `${cur} : ${cot}`
                }
                
            }
            
            var key  = Object.keys(ini)
            var val = Object.values(ini).sort();
            var ber = ""
            for(var i in key){
                ber += val[i]+"<br>"
            }
            $('#hasil2').html(ber)
           
        }
    </script>
</body>
</html>
```

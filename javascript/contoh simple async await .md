# contoh simple async await 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Document</title>
</head>
<body>
    <div class="w3-container w3-padding w3-white w3-round ">
        <h3>input data</h3>
        <input id="judul" type="text" placeholder="judul">
        <input id="gambar" type="text" placeholder="gambar">
        <textarea id="keterangan" placeholder="keterangan"></textarea>
        <div class="clearfix">
            <button id="simpan" class="button-outline float-right">simpan</button>
        </div>
    </div>
    <button id="nama">namanya</button>

    

    <script>
        

        $(async ()=>{

            $('#simpan').click(()=>{
            var judul = $('#judul').val()
            var gambar = $('#gambar').val()
            var ket = $('#keterangan').val()

            if(judul == "" || gambar == "" || ket == ""){

                alert('gak bole kosong')
                return;
            }

            var paket = {
                id:null,
                judul:judul,
                gambar:gambar,
                ket:ket
            }

            
           $.post('/tambah-konten',JSON.stringify(paket),(a,b)=>{
               console.log(a)
           })

        });

        var apa = JSON.parse(await $.get('/lihat-isi'));
        $('#nama').html(apa[0].gambar)
        
        




        })
        
    </script>
</body>
</html>
```

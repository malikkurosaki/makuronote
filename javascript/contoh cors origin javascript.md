# cors origin javascript

```html
<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>

<body> 

    <h1 id="sini">buat user</h1>
    <div>
        <input id="nama" placeholder="nama"><br>
        <input id="email" placeholder="email"><br>
        <input id="pass" placeholder="pass"><br>
        <input id="unit" placeholder="unit"><br>
        <button id="simpan">simpan</button>
    </div>

   
</body>

<script>
    $("#simpan").click(() => {
        var nama = $("#nama").val()
        var email = $("#email").val()
        var pass = $("#pass").val()
        var unit = $("unit").val()

        if(nama == "" || email == "" || pass == "" || unit == ""){
            return $("#sini").html("gak bole ada yang kosong")
        }

        $.ajax({
            url: "http://localhost:8080/apa",
            type: "GET",
            crossDomain: true,
            //data: JSON.stringify(somejson),
            dataType: "json",
            success: (a,b)=>{
                $("#sini").html(a.status)
            },
            error: function (xhr, status) {
                $("#sini").html(status)
            }
        });
    
    })
</script>

</html>

```

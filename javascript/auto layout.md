# auto layout

```js
 var mn = ["satu macamnya","dua","tiga"]
        function cobaMenu(mn){
            var ini = document.createElement('div');
            ini.setAttribute('class','p-3 col-2 d-flex flex-column bg-light h-100 overflow-auto')

            var itu = document.createElement('div');
            itu.setAttribute('class','p-3 col-10 h-100 overflow-auto')

            for (var i = 0; i < mn.length;i++){
                const m = document.createElement('a')
                $(m).attr('class', 'p-2 a nav-link');
                $(m).attr('href', '#');
                $(m).attr('id', `${mn[i]}_${i}`);
                $(m).html(mn[i])
                $(ini).append(m);

                const n = document.createElement('div')
                $(n).attr('class', 'b');
                $(n).attr('id', `${mn[i].replace(' ','_')}`);
                $(n).html("body "+mn[i])
                $(itu).append(n);
            }

            const con = document.createElement('div')
            $(con).attr('class', 'container-fluid row h-100');

            const header = document.createElement('div')
            $(header).attr('class', 'p-3 bg-light');
            $(header).attr('id', 'hdr');
            
            $(con).append(ini);
            $(con).append(itu);

            $(document.body).append(header);
            $(document.body).append(con);

            $('.b').hide()
            $('.b')[0].style.display = "block"

            $('.a').click((a) => {
                var idNya = a.target.id.toString().split('_')[1]
                for(var i = 0; i < $('.a').length;i++){
                    if(idNya == i){
                        $('.b')[i].style.display = "block"
                    }else{
                        $('.b')[i].style.display = "none"
                    }
                }
            })
            
        }
        
        cobaMenu(mn);
        $(`#${mn[0].replace(' ','_')}`).html("ini apa namanya")
```


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-analytics.js"></script>


    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <style>
        html, body {
            height: 100%;
        }
        .tinggi-full {
            min-height: 100%;
            height: 100%;
        }
    </style>
</head>
<body class="h-100">
    <script>
        var firebaseConfig = {
          apiKey: "AIzaSyBYuFOnV0i3AJZZMh2CKboMUJih0oOQ3BM",
          authDomain: "projekku-e82f7.firebaseapp.com",
          databaseURL: "https://projekku-e82f7.firebaseio.com",
          projectId: "projekku-e82f7",
          storageBucket: "projekku-e82f7.appspot.com",
          messagingSenderId: "883876449851",
          appId: "1:883876449851:web:7dceb1e291609923b4161e",
          measurementId: "G-9N898DPSQ7"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        var db = firebase.firestore();
      </script>
    

    <!-- <button id="lihat" onclick="lihatGroup()">lihat group</button>
    <button id="tambah" onclick="tambah()">tambah group</button>
    <button id="setting" onclick="setting()">setting</button> -->


    <!-- <div class="container-fluid h-100">
        <div class="row tinggi-full">
            <nav class="col-2 navbar-nav bg-light h-100 tinggi-full">
                <a id="a_0" href="#" class="a nav-link p-2 ">lihat group</a>
                <a id="a_1" href="#" class="a nav-link p-2 ">log</a>
                <a id="a_2" href="#" class="a nav-link p-2 ">tiga</a>
                <a id="a_2" href="#" class="a nav-link p2"> tambah group</a>
            </nav>
            <div class="col-10 h-100 d-inline-block tinggi-full overflow-auto">
                <div id="b_0" class="b">
                    satu 
                </div>
                <div id="b_1" class="b">dua</div>
                <div id="b_2" class="b">tiga</div>
                <div id="b_3" class="b">tambah group</div>
            </div>
        </div>
    </div> -->


    <script>
        var mn = ["satu macamnya","dua","tiga"]
        function cobaMenu(mn){
            var ini = document.createElement('div');
            ini.setAttribute('class','p-3 col-md-2 col-xs-12 col-sm-12 d-flex flex-column bg-light')

            var itu = document.createElement('div');
            itu.setAttribute('class','p-3 col-md-10 col-sm-12 col-xs-12 h-100 overflow-auto border-top border-left')

            for (var i = 0; i < mn.length;i++){
                const m = document.createElement('a')
                $(m).attr('class', 'p-2 a nav-link');
                $(m).attr('href', '#');
                $(m).attr('id', `${mn[i]}_${i}`);
                $(m).html(mn[i])
                $(ini).append(m);

                const n = document.createElement('div')
                $(n).attr('class', 'b');
                $(n).attr('id', `${mn[i].replace(' ','_')}`);
                $(n).html("body "+mn[i])
                $(itu).append(n);
            }

            const con = document.createElement('div')
            $(con).attr('class', 'container-fluid row h-100 p-0 m-0');

            const header = document.createElement('div')
            $(header).attr('class', 'p-3 bg-light container-fluid');
            $(header).attr('id', 'hdr');
            
            $(con).append(ini);
            $(con).append(itu);

            $(document.body).append(header);
            $(document.body).append(con);

            $('.b').hide()
            if(localStorage.getItem('menu') == null){
                $('.b')[0].style.display = "block"
                $('.a')[0].classList.add('border-bottom')
            }else{
                $('.b')[localStorage.getItem('menu')].style.display = "block"
                $('.a')[localStorage.getItem('menu')].classList.add("border-bottom")
            }
            

            $('.a').click((a) => {
                var idNya = a.target.id.toString().split('_')[1]
                localStorage.setItem('menu',idNya)
                console.log(localStorage.getItem('menu'))
                for(var i = 0; i < $('.a').length;i++){
                    if(idNya == i){
                        $('.b')[i].style.display = "block"
                        $('.a')[i].classList.add("border-bottom")
                    }else{
                        $('.b')[i].style.display = "none"
                        $('.a')[i].classList.remove("border-bottom")
                    }
                }
            })
            
        }
        
        cobaMenu(mn);
        $(`#${mn[0].replace(' ','_')}`).html("ini apa namanya")


        function panelMenu(){
            $('.b').hide()
            $('.b')[0].style.display = "block";
            $('.a').click((a) => {
                var idNya = a.target.id.toString().split('_')[1]
                for(var i = 0; i < $('.a').length;i++){
                    if(idNya == i){
                        $('.b')[i].style.display = "block"
                    }else{
                        $('.b')[i].style.display = "none"
                    }
                }
            })
        }
        //panelMenu();

        function lihatLog(){
            var maka = " ";
            db.collection('users').doc('malik').collection('log').orderBy('tanggal').get().then((apa) => {
                apa.forEach((ini) => {
                    const datanya = ini.data()
                    maka += `<small>${datanya['tanggal']} : ${datanya['isi']} </small><br>`
                })
                $('#b_1').html(maka)
            })
            db.collection('users').doc('malik').collection('log').onSnapshot((snap) => {
                snap.docChanges().forEach((e) => {
                    //console.log(e)
                })
            })

        }
        //lihatLog();
        

    </script>

    <script>
        console.log(new Date().toISOString().split('T')[0])
        
        function lihatLog(){
            db.collection('users').doc('malik').collection('log').get().then( (q) => {
                q.forEach( (a) => {
                    // console.log(a.data())
                })
            })
        }

        //lihatLog()

        async function perlihatkan(){
            db.collection("groups").where("user","==","malik").onSnapshot( async (snapshot) => {
                var lihat = []
                var lihatnya = `<table class="table table-sm table-bordered dense bg-light h-100">`
                await snapshot.docChanges().forEach(function(change) {
                    lihat.push(change.doc.data())
                })
                lihat = [...new Set(lihat)]
                lihatnya += `<tr class="bg-dark text-light">`
                lihatnya += `<td>NO</td>`
                lihatnya += `<td>NAMA</td>`
                lihatnya += `<td>ALAMAT</td>`
                lihatnya += `<td>USER</td>`
                lihatnya += `</tr>`
                for(var i = 0; i < lihat.length;i++){
                    lihatnya += `<tr>`
                    lihatnya += `<td>${i+1}</td>`
                    lihatnya += `<td>${lihat[i].nama}</td>`
                    lihatnya += `<td>${lihat[i].alamat}</td>`
                    lihatnya += `<td>${lihat[i].user}</td>`
                    lihatnya += `</tr>`
                }
                lihatnya += `</table>`

                $('#b_0').html(lihatnya)
            });
        }

        //perlihatkan();

        async function lihatSetting(){
            await db.collection('app').doc('setting').onSnapshot((snapshot) => {
                console.log(snapshot.data())
            });
        }

        //lihatSetting();


        function tambah(){
            $.get('/tambah-group',(a,b)=>{
                alert(JSON.stringify(a))
            });
        }

        async function setting(){
            $.get('/setting',(a,b)=>{
                alert(JSON.stringify(a))
            })
        }

        function lihatGroup(){
            $.get('/lihat-group',(a,b)=>{
                alert("data group diperbarui")
                window.location.reload()
            })
            
        }

        
    </script>
</body>
</html>
 ```

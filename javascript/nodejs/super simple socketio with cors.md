# super simple socketio with cors

```js
const server = require('http').createServer();
const parser = require('socket.io-json-parser')
const io = require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  }
);

io.on('connection', socket => {
    socket.on('chat',(data) => {
        io.emit('chat',data)
        console.log(data)
    })
})

server.listen(3000);

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
    <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-database.js"></script>
    <!-- <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-firestore.js"></script> -->
    <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase-analytics.js"></script>

    <script src="js/auto_layout.js"></script>
    <!-- <script>$(() => { $('#ikut').load('./template/template.html')})</script> -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.min.js"></script> -->
    <script src="/socket.io/socket.io.js"></script>

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
        var db = firebase.database();
    </script>
    <button id="tekan">tekan sisi</button>


    <script>
        console.log("mulai")
        const socket = io("http://localhost:3000");
        socket.on('chat',(data) => {
            console.log(data)
        })
        
        $('#tekan').click(function (e) { 
            socket.emit('chat',"hai apa kabar chat ii")
        });

        

    function meload(){
        var mn = ["list group nya","log","tambah group","setting"]
        autoLayout(mn);

        async function lihatLog(id){
            var maka = " ";
            await db.collection('log').where('user',"==","malik").onSnapshot(async (snap) => {
                snap.docChanges().forEach((ini) => {
                    let datanya = ini.doc.data()
                    maka += `<small>${datanya['tanggal']} : ${datanya['isi']} </small><br>`
                })

                $(`#${id.replaceAll(' ','_')}`).append(maka)
            })
        }
        lihatLog(mn[1]);
        

        function menambahGroup(id){
            db.collection('setting').doc('users').get().then((snap) => {
               
                let usr = snap.data()['data']

                var opt = 
                `<div class="">`+
                `<select id="slk" class="form-control">`+
                `<option>pilih user</option>`

                usr.forEach((a) => {
                    opt += `<option>${a}</option>`
                })

                opt += `</select> </div>`+
                `<input id="kc" class="form-control mt-4" placeholder="kata kunci ">`+
                `<button id="tmb" class="form-control mt-4 bg-light">TAMBAH</button>`
                $(`#${id.replaceAll(' ','_')}`).append(opt)

                $('#tmb').click(() => {
                    if($('#slk').val() == "pilih user" || $('#kc').val() == ""){
                        alert('pilih user dan kata kunci')
                        return
                    }
                })
            });
            
        }
        menambahGroup(mn[2])

        async function listGroup(id){
            const re = document.createElement('button')
            $(re).html("perbarui data")
            $(re).attr('class', 'btn btn-light');
            $("#"+id.replaceAll(' ','_')).append(re);

            $(re).click(() => {
                lihatGroup()
            })

            db.collection("groups").where("user","==","malik").onSnapshot( async (snapshot) => {
                var lihat = []
                var lihatnya = `<small><table class="table table-sm table-bordered dense bg-light h-100">`
                await snapshot.docChanges().forEach(function(change) {
                    lihat.push(change.doc.data())
                })
                lihat = [...new Set(lihat)]
                lihatnya += `<tr class="bg-dark text-light">`
                lihatnya += `<td>NO</td>`
                lihatnya += `<td>ID</td>`
                lihatnya += `<td>NAMA</td>`
                lihatnya += `<td>ALAMAT</td>`
                lihatnya += `<td>USER</td>`
                lihatnya += `</tr>`
                for(var i = 0; i < lihat.length;i++){
                    lihatnya += `<tr>`
                    lihatnya += `<td>${i+1}</td>`
                    lihatnya += `<td>${lihat[i].id}</td>`
                    lihatnya += `<td><a target="_blank" href="${lihat[i].alamat.replace('m.','')}">${lihat[i].nama}</a></td>`
                    lihatnya += `<td>${lihat[i].alamat}</td>`
                    lihatnya += `<td>${lihat[i].user}</td>`
                    lihatnya += `</tr>`
                }
                lihatnya += `</table></small>`

                $(`#${id.replaceAll(' ','_')}`).append(lihatnya);
            });
        }
        listGroup(mn[0]);

        async function lihatSetting(){
            await db.collection('app').doc('setting').onSnapshot((snapshot) => {
                console.log(snapshot.data()['data'])
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
    }


    </script>

</body>
</html>
```

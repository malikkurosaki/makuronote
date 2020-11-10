# firestore

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


</head>
<body>
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
    

    <button id="lihat" onclick="lihatGroup()">lihat group</button>
    <button id="tabah" onclick="tambah()">tambah group</button>
    <button id="setting" onclick="setting()">setting</button>
    <div id="ini">ini</div>

    <script>

        db.collection("groups").onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                console.log(change.doc.data())
            })
        });


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
            var hsl = ''
            $.get('/lihat-group',(a,b)=>{
                hsl += `<ol>`
                for(var x = 0; x < a.length; x++){
                    hsl += `<li>`
                    hsl += `<div>${a[x]['nama']}</div>`
                    hsl += `<a href="${a[x]['alamat']}">${a[x]['alamat']}</a>`
                    hsl += `</li>`
                }
                hsl += `</ol>`
            })
        }

        
    </script>
</body>
</html>

```

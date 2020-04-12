# penerapan firebase database

```html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-database.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <link rel="stylesheet" href="w3.css">
        <style>
            .w3-container{
                padding: 0px;
            }
        </style>
    </head>
    <body>

        <h1 class="w3-text-teal">Flutter Dari Noll</h1>
        <div class="w3-container w3-content ">
            <table class="w3-table-all">
                <tr class="w3-black">
                    <th class="">
                        buku belajar flutter dari nol v1 rev 1
                    </th>
                    <th class="">
                        buku belajar flutter dari nol v2
                    </th>
                </tr>
                <tr class="w3-padding">
                    <td>
                        <img class="w3-round w3-card" src="https://github.com/makuroworkshop/makuroworkshop.github.io/blob/master/assets/images/coverv1.png?raw=true" style="width: 100%;"> 
                    </td>
                    <td>
                        <img class="w3-round w3-card" src="https://github.com/makuroworkshop/makuroworkshop.github.io/blob/master/assets/images/coverv2.png?raw=true" style="width: 100%;">
                    </td>
                </tr>
                <tr class=" w3-padding">
                    <td class="">
                        <a id="download1" class="w3-container w3-button w3-round w3-text-blue w3-large" href="https://raw.githubusercontent.com/makuroworkshop/makuroworkshop.github.io/master/assets/book/Flutter%20Dari%20Noll.pdf">download </a>
                        <i id="buk1" class="w3-container w3-padding w3-text-grey"></i>
                    </td>
                    <td class="">
                        <a id="download2" class="w3-container w3-button w3-round w3-text-blue w3-large w3-center" href="https://raw.githubusercontent.com/makuroworkshop/makuroworkshop.github.io/master/assets/book/Flutter%20Dari%20noll%20-v2.pdf">download</a>
                        <i id="buk2" class="w3-container w3-padding w3-text-grey"></i>
                    </td>
                </tr>
               
            </table>
            <h2 class="w3-padding">saran masukan dan pertanyaan</h2>
            <table class="w3-table-all">
                <tr>
                    <td>
                        <div id="komen" class="">loading comment ...</div>
                    </td>
                    <td class="w3-light-grey">
                        <div class="w3-container ">
                            <div class="w3-margin-bottom">
                                <input id="nama" class="w3-input" placeholder="nama">
                                <textarea id="isi" class="w3-input" cols="5" rows="5" placeholder="ketik sesuatu"></textarea>
                                <button id="kirim" class="w3-button w3-round w3-card w3-blue w3-input">kirim</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

        </div>
        <div class="w3-padding">
            web ini dibuat hanya menggunakan github io javascript dan firebase sebagai database, yang mau tutor atau minta source code wa aja ke 081338929722
            <br>
            malikkurosaki@2020
        </div>


        <script>
            // Your web app's Firebase configuration
            var buku1;
            var buku2;

            var refKlickBuku1 = "buku/download/buku1";
            var refKlickBuku2 = "buku/download/buku2";

            var buk1 = document.getElementById("buk1")
            var buk2 = document.getElementById("buk2")

            var test = document.getElementById("test")

            var download1 = document.getElementById("download1");
            var download2 = document.getElementById("download2");

            var komen = document.getElementById("komen");

            var nama = document.getElementById("nama");
            var isi = document.getElementById("isi");
            var kirim = document.getElementById("kirim");

            var firebaseConfig = {
              apiKey: "AIzaSyDNVlrTm7yXtbUXeDhRZ06yIob0czbpfIo",
              authDomain: "panduan-flutter.firebaseapp.com",
              databaseURL: "https://panduan-flutter.firebaseio.com",
              projectId: "panduan-flutter",
              storageBucket: "panduan-flutter.appspot.com",
              messagingSenderId: "528518214220",
              appId: "1:528518214220:web:e61e2d643cf2a49ecd7ae9",
              measurementId: "G-TWFGEH3N5B"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
            
            // firebase.database().ref("buku/download/buku2").set({
            //     "click":""
            // }).then((snapshot)=>{
                
            // });

            firebase.database().ref('buku').on("value",(snapshot)=>{

                buku1 = snapshot.val().download.buku1.click;
                buku2 = snapshot.val().download.buku2.click;

                buk1.innerHTML = `total ${buku1} download`
                buk2.innerHTML = `total ${buku2} download`
            });

            download1.onclick = ()=>{
                firebase.database().ref(refKlickBuku1).set({
                    "click": Number(buku1)+1
                });
            }
            download2.onclick = ()=>{
                firebase.database().ref(refKlickBuku2).set({
                    "click":Number(buku2)+1
                })
            }

            kirim.onclick = ()=>{
                if(nama.value == "" || isi.value == ""){
                    alert("anda dilarang mengirim sesuatu yang kosong")
                    return;
                }
                firebase.database().ref("buku/komen/").push().set({
                    "nama":nama.value,
                    "isi":isi.value
                },(err)=>{
                    if(err){
                        alert("pesan tidak terkirim");
                        return;
                    } 
                })
                isi.value = ""
            }

            firebase.database().ref("buku/komen/").on("value",(snap)=>{
                
                var dat = []
                snap.forEach(element => {
                   var kom = `
                    <div class="w3-margin-bottom w3-light-grey w3-tag w3-round w3-container ">
                        <div class="w3-tag w3-round">${element.val().nama}</div> 
                        <div class="w3-tag w3-light-grey w3-padding w3-round"> <i class="w3-text-grey">${element.val().isi}</i></div>
                    </div>
                    <br>

                   `
                   dat.push(kom)
                });
                dat.reverse();
                komen.innerHTML = dat.join("");
            })

          </script>
    </body>
</html>
```

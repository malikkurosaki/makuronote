# backup admin api presto post

```javascript
doctype
html
    head
        link(rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css")
        script(src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js")
        style.
            .w3-container{
                padding:0px;
            }
            .container {
                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                scrollbar-width: none;  /* Firefox */
               
            }
            .container::-webkit-scrollbar { 
                display: none;  /* Safari and Chrome */
            
            }
    body.w3-light-grey
        .w3-content.w3-container.w3-center
            h1 Presto Pos Server Util
            hr.w3-border.w3-border-blue

        .w3-container.w3-row.w3-padding
            .w3-container.w3-quarter
                .w3-xlarge.w3-padding.w3-blue-grey Route /Post
                #list_route_post.w3-padding
            .w3-container.w3-bar-block.w3-round.w3-border.w3-quarter.w3-white.w3-border-light-grey
                .w3-xlarge.w3-padding.w3-blue-grey Route /Get
                #menu_route
            .w3-container.w3-half
                .w3-xlarge.w3-padding.w3-blue-grey Content
                #lihat.w3-black.w3-text-green.w3-black
                    
            
        script.

    
            // route get
            function lihat(e,event){
                var routeApa = "";
                var x = event.which || event.keycode
                if(x === 13){
                    e.id = e.value
                    $.get(`/${e.id}`,(a,b)=>{
                        routeApa += `<div class="w3-container w3-black  w3-padding w3-large">Route /${e.value}<br> <hr></div>`
                        routeApa += `<pre style="overflow:scroll" class="w3-small container"><div class="w3-padding">${JSON.stringify(a,undefined, 2)}</div></pre>`
                        $("#lihat").html(routeApa)
                    })
                }
                
            }

            function lihatPost(e,x){
                var routeApaPost= "";

                if(x == 1){
                    if($("#idpost").val() == ""){
                        alert("post gk bole kosong")
                        return;
                    }
                    var paket = {
                       "meja":$("#idpost").val(),
                       "lokasi":"mobile device",
                       "kd_out":"kasir"
                    }
                    $.post(`/booking-meja`,paket,(a,b)=>{
                        $.get(`/lihat-mejaisi`,(a,b)=>{
                            $("#lihat").html(`<pre>${JSON.stringify(a,undefined, 2)}</pre>`)
                        })
                    })
                }
                

                $("#lihat").html(x)
            }

            var listRoute = [
                "lihat-table-bill", // 0
                "lihat-table-listbill", // 1 
                "lihat-table-listmeja", // 2
                "lihat-table-produk", // 3
                "lihat-table-waiter", // 4
                "semua-user", // 5
                //"lihat-produk", // 6
                "lihat-all-table", // 7
                "lihat-mejaisi", // 8
                "cek-mejaisi/1", // 9
                "lihat-customer", // 10
                "bersihkan-booking-meja", // 11
                "lihat-meja-booked", // 12
                "lihat-produk", // 13
                "lihat-semua-produk", //14
                "lihat-produk-food", //15
                "lihat-produk-beverage", // 16
                "lihat-produk-other", //17
                "lihat-produk-group", //18
                "lihat-produk-subgroup/food", //19
                "lihat-produk-group-sub/food/personal", //20
                "lihat-outlet",  //21
                "lihat-waiter",
                "tanggal-sekarang",
                //"lihat-outlet",
                "lihat-meja-open/",
            ]

            var listRoutePost = [
                "booking-meja"
            ]


            var itemNya = "";
            for(var i=0;i<listRoute.length;i++){
                
                switch(i){
                    case 13:
                        itemNya += `<hr><div class="w3-container w3-text-blue">PRODUK</div>`
                    break;
                    case 8:
                        itemNya += `<hr><div class="w3-container w3-text-blue">MEJA</div>`
                    break;
                    case 0:
                        itemNya += `<hr><div class="w3-container w3-text-blue">TABLE</div>`
                    break;
                    case 21:
                        itemNya += `<hr><div class="w3-container w3-text-blue">PERCOBAAN</div>`
                    break;
                }
                itemNya +=`<div class="w3-container w3-padding"><input class="w3-small w3-input" id="${listRoute[i]}" onkeyup="lihat(this,event)" value="${listRoute[i]}"></div>`
            }
             $(`#menu_route`).html(itemNya)


            var pItem = "";
            for(var x =0;x<listRoutePost.length;x++){
                pItem +=`<div class="w3-bar-item"><div class="w3-circle w3-border w3-cell w3-padding">${x+1}</div><input id="idpost"></div><div id="${listRoutePost[x]}" onclick="lihatPost(this,x)" class="w3-cell w3-button" value="${listRoutePost[x]}">/${listRoutePost[x]} </div>`
            }
           $("#list_route_post").html(pItem)

```

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

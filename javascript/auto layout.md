# auto layout

```js
var mn = ["satu","dua","tiga"]
        function cobaMenu(mn){
            var ini = document.createElement('div');
            ini.setAttribute('class','p-3 col-2 d-flex flex-column')

            var itu = document.createElement('div');
            itu.setAttribute('class','p-3 col-10')

            for (var i = 0; i < mn.length;i++){
                const m = document.createElement('a')
                $(m).attr('class', 'p-2 a');
                $(m).attr('href', '#');
                $(m).attr('id', `${mn[i]}_${i}`);
                $(m).html(mn[i])
                $(ini).append(m);

                const n = document.createElement('div')
                $(n).attr('class', 'b');
                $(n).attr('id', `${mn[i]}`);
                $(n).html("body "+mn[i])
                $(itu).append(n);
            }

            const con = document.createElement('div')
            $(con).attr('class', 'container-fluid bg-light row');
            $(con).append(ini);
            $(con).append(itu);
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
        $(`#${mn[0]}`).html("ini apa namanya")
        
```

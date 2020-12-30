# hash router

```js
$('.menu').hide()
$(`${localStorage.getItem('menu') || '#satu'}`).show();
location.hash = `${localStorage.getItem('menu') || '#satu'}`;
$(window).on('hashchange', (e) => {
    window.localStorage.setItem("menu", location.hash)
    $('.menu').hide()
    $(':target').show()
})

```

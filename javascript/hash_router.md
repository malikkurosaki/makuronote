<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [hash router](#hash-router)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

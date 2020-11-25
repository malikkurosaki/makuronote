# javascript next on enter form

```javascript
 // next ketika enter
        $('.form-control').keydown(function (e) {
            if (e.which === 13) {
                var index = $('.form-control').index(this) + 1;
                $('.form-control').eq(index).focus();
            }
        });
```

update simple

```js
$('INPUT').keydown( e => e.which === 13?$(e.target).next().focus():"");
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [javascript next on enter form](#javascript-next-on-enter-form)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

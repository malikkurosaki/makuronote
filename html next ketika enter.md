# html next ketika enter

```
$('.inputs').keydown(function (e) {
         if (e.which === 13) {
             var index = $('.inputs').index(this) + 1;
             $('.inputs').eq(index).focus();
         }
     });
```

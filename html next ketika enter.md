<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [html next ketika enter](#html-next-ketika-enter)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# html next ketika enter

```
$('.inputs').keydown(function (e) {
         if (e.which === 13) {
             var index = $('.inputs').index(this) + 1;
             $('.inputs').eq(index).focus();
         }
     });
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
const hasil = JSON.stringify(
        result,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
```

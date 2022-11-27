```js
const hasil = JSON.stringify(
        result,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
```

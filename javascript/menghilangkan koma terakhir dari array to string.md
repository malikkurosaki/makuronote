# menghilangkan koma terakhir dari array to string

```javascript
pisah.toString().replace(/,(?=[^,]*$)/, '')
```

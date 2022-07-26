```js
console.log(process.env.DATABASE_URL.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/).slice(1, 6).join(' ').split(' '))
```

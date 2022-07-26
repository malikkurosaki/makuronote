```js
let ini = exec('git branch');
    ini.stdout.on('data', (data) => {
        console.log(`${data}`.match(/\*\s(.*)/)[1]);
    });
```

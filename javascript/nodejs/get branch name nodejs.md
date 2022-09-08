```js
const ini = execSync(`git branch`).toString().split("\n").find((e) => e.indexOf('*') === 0).toString().split(' ')[1].trim();
```

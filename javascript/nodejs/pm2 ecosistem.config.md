# pm2 ecosystem

ecosystem.config.js

```js
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    "watch": true,
    "ignore_watch": [“node_modules”],
    "wait_ready": true
  }]
}
```

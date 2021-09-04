# pm2 ecosystem

ecosystem.config.js

```js
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
```

# pm2 ecosystem

ecosystem.config.js

```js
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    watch: true,
    watch_delay: 1000,
    ignore_watch: [“node_modules”],
    wait_ready: true,
    watch_options: {
        followSymlinks: false,
      }
  }]
}
```


### version 2

```js
module.exports = {
  apps: [
    {
      name: 'api',
      script: './bin/www', // --------------- our node start script here like index.js

      // ------------------------------------ watch options - begin
      watch: ['../'],
      watch_delay: 1000,
      ignore_watch: ['node_modules'],
      watch_options: {
        followSymlinks: false,
      },
      // ------------------------------------ watch options - end

      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        DEBUG: 'api:*',
        MONGODB_URI:
          'mongodb://localhost:27017/collection1?readPreference=primary&ssl=false',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
        // user: "SSH_USERNAME",
        // host: "SSH_HOSTMACHINE",
    },
  },
};
```

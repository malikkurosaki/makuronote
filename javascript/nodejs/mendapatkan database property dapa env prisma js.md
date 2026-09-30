<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [update](#update)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
console.log(process.env.DATABASE_URL.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/).slice(1, 6).join(' ').split(' '))
```


### update
```js
let dbPreff = process.env.DATABASE_URL.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/).slice(1, 6).join(' ').split(' ');
let db = {
    user: dbPreff[0],
    password: dbPreff[1],
    host: dbPreff[2],
    port: dbPreff[3],
    database: dbPreff[4]
}
```

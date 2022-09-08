```js
const router = require('express').Router();
const fs = require("fs");
const path = require('path');
const _ = require('lodash');

const target = path.join(__dirname, "./xrouter");
const dir = fs.readdirSync(target);

for(let itm of dir){
    let name = _.kebabCase(path.parse(itm).name);
    let method = path.parse(itm).name.split("_").splice(-1)[0];

    router[method](`/api/${name}`, require(`${target}/${itm}`));
}

module.exports = router;


```

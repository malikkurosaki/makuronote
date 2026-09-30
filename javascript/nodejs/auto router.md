<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```
const routers = require('express').Router();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const targetDir = path.join(__dirname, "./routers");
const listRouter = fs.readdirSync(targetDir);

for (let itm of listRouter) {
    let dir = path.join(targetDir, itm);
    let listDir = fs.readdirSync(dir);
    for (let itmDir of listDir) {
        let name = path.parse(itmDir).name;
        let method = path.parse(itmDir).name.split('_').splice(-1);
        routers[method](`/${_.kebabCase(name)}`, require(`${dir}/${itmDir}`));
    }

}

module.exports = routers;
```

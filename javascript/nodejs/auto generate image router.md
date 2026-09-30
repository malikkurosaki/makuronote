<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
const fs = require('fs');
const path = require('path');
const dir = fs.readdirSync(path.join(__dirname, "./assets/images"));
const routeImage = require('express').Router();
const _ = require('lodash');

routeImage.get(`/image-assets/:name`, (req, res) => {

    if (fs.existsSync(path.join(__dirname, `./assets/images/${req.params.name}`))) {
        res.sendFile(path.join(__dirname, `./assets/images/${req.params.name}`));
        return;
    } else {
        res.sendFile(path.join(__dirname, `./assets/default.png`));
        return;
    }

},);

module.exports = routeImage;

```

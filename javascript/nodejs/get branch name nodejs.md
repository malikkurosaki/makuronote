<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
const ini = execSync(`git branch`).toString().split("\n").find((e) => e.indexOf('*') === 0).toString().split(' ')[1].trim();
```

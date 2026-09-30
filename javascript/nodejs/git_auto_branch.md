<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    execSync(`git add . && git commit -m "auto commit" && git push origin ${branch}`, { stdio: 'inherit' , cwd: path.join(__dirname, '../../../')});
    console.log(`push success branch : ${branch}`.cyan);
```

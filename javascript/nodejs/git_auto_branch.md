```js
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    execSync(`git add . && git commit -m "auto commit" && git push origin ${branch}`, { stdio: 'inherit' , cwd: path.join(__dirname, '../../../')});
    console.log(`push success branch : ${branch}`.cyan);
```

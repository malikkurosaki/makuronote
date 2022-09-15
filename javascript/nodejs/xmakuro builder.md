```js
#!/usr/bin/env node
const fs = require('fs');

const targetFile = fs.readFileSync('./xmakuro').toString();
const getFunc = targetFile.match(/function\s+\w+\s*\(\s*\)\s*/g).map(e => e.split(' ')[1].replace('()', ''));

// const listMenu = []
const getListMenu = targetFile.match(/\w+\s*listMenu[\s\S]+.*\]/g)
const hasil = targetFile.replace(getListMenu[0], `const listMenu = ${JSON.stringify(getFunc)}`)

fs.writeFileSync('./xmakuro', hasil)

```

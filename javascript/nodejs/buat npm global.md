# buat npm global 


1. jalankan perintah "npm init --yes"
2. edit file package.json

```json
{
  "name": "global",
  "version": "1.0.0",
  "description": "",
  "bin": {
    "presto": "index.js"
  },
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "malikkurosaki",
  "license": "ISC"
}
```


3. buat file index.js

```js
#!/usr/bin/env node

console.log("apa kabar");
```

4. jalankan perintah "npm link"

udah gitu doang

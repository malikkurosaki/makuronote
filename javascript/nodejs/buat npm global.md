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
  "license": "ISC",
  "dependencies": {
      "colors": "^1.2.1",
      "lodash": "^4.17.5"
   }
}
```


3. buat file index.js

```js
#!/usr/bin/env node

console.log("apa kabar");
```

4. jalankan perintah "npm link"

udah gitu doang

tambahan

penginstalan selain "npm link"

1. "npm install -g local_dir_path"
2. "npm install -g ./" jika berada didalam folder


tambahan lagi

untuk membut perintah seperti `nodemon --ini itu`

```js
const arg = process.argv.splice(2);
console.log(arg);
```

# nodejs pkg 

**package.json**

```json
{
  "name": "pkg",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bin": "bin.js",
  "pkg": {
    "targets": [
      "node14-macos-x64"
    ],
    "outputPath": "dist"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}

```

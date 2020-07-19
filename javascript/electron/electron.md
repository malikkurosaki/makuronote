# electron

### main.js

```js
'use strict'
const {BrowserWindow, app, Menu} = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
const {exp} = require('./app')
require('electron-reload')(__dirname);
const express = exp();


(async()=>{
  
  function setMainMenu(app) {
    const template = [
      {
        label: 'Menu',
        submenu: [
          {
            label: 'Hello',
            //accelerator: 'Shift+CmdOrCtrl+H',
            click() {
                console.log('Oh, hi there!')
            }
          },
          {
            label:"kemana gt",
            click(){
              console.log('ini adalah ')
            }
          }
        ]
      },
      {
        label:"lihat",
        submenu:[
          {
            label:"restart",
            click(){
              app.relaunch();
              app.exit();
            }
          }
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

  setMainMenu(app);
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);
  const window = new BrowserWindow();
  await window.loadURL('http:localhost:5000');
  const page = await pie.getPage(browser, window);

  express.get('/dimana',async (req,res)=>{
    await page.goto('https://google.com');
    await page.$eval('body', elements => {
     
      let nav = document.createElement('div');
      nav.style.padding = '10px';
      nav.style.position = "fixed";
      nav.innerText = "apa kabar"
      elements.appendChild(nav)
    });
    
  })

  express.get('/kembali',async (req,res)=>{
    await page.goto('http://localhost:5000');
  })

})();

```

### package.json

```json
{
  "name": "your-app",
  "version": "0.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder build"
  },
  "devDependencies": {
    "electron": "^9.1.0",
    "electron-builder": "^22.7.0",
    "electron-reload": "^1.5.0"
  },
  "dependencies": {
    "electron-router": "^0.4.4",
    "electron-updater": "^4.3.1",
    "express": "^4.17.1",
    "puppeteer-core": "^5.2.0",
    "puppeteer-in-electron": "^3.0.3"
  },
  "build": {
    "appId": "com.malik.app",
    "productName": "malik App",
    "copyright": "Copyright © malik kurosaki",
    "mac": {
      "category": "public.app-category.developer-tools"
    }
  }
}

```

### app.js

```js
// (async()=>{
//     "use strict";
//     let express = require('express');

//     let app = express();

//     app.get('/', function(req, res) {
//         res.sendFile(__dirname+'/views/index.html');
//     });

//     app.get('/baru',(req,res)=>{
//         console.log('apa kabarnya');
//     })

//     let server = app.listen(5000, function () {
//         console.log('Express server listening on port ' + server.address().port);
//     });

    
//     module.exports = app;
// })()

module.exports = {
    exp : ()=>{
        let express = require('express');

        let app = express();

        app.get('/', function(req, res) {
            res.sendFile(__dirname+'/views/index.html');
        });

        app.get('/baru',(req,res)=>{
            console.log('apa kabarnya');
        })

        let server = app.listen(5000, function () {
            console.log('Express server listening on port ' + server.address().port);
        });

        return app;
    }
};
```

# backup auto post

```js
const puppeteer = require('puppeteer');
const colors = require('colors');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./db.json');
const fs = require("fs");

// posting ke fb group otomatis
(async () => {

  const judulNya = "(COD) Bayar dirumah 💋💋Karpet bulu rasfur tebal  double set bantal 2pcs";
  const hargaNya = "350000";
  const gambar = fs.readdirSync(__dirname+"/images").map(e => __dirname+'/images/'+e);
  const keteranganNya = 
  `
    Bayar dirumah/COD

    RASFUR CARPET
    Ready Stock
   

    High quality

    1. -We use Karindo rasfur, 
    -anti slippery, and zipper(on the bottom side). 
    2. With Royal foam, which has a thickness of 6.5 cm.

    For more questions about colors, size, stock, or etc please contact us either WA or messenger. 
  `
  ;

  // const browser = await puppeteer.launch(
  //     {
  //         headless:false,
  //         args: ['--no-sandbox'], 
  //         userDataDir: "./akun/user_vita",
  //         devtools: false,
  //         ignoreHTTPSErrors: true,
  //         args: ['--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1'],
  //     }
  // )

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./akun/user_vita",
  })
  const page = await browser.newPage()
  //await page.emulate(puppeteer.devices['iPhone 8']);
  //await page.setViewport({ width: 320, height: 846 })

   console.log('=> cari group'.green)
    await page.goto('https://mbasic.facebook.com/groups/?seemore',{ waitUntil: 'load'})
    const link = await page.$x('//a[@href]');
    const groups = await page.evaluate((...link) => {
        let data = [];
        for(var i=0;i<link.length;i++){
            if(link[i].href.includes(link[i].href.toString().match(/\/\d{10,}\?/g))){
              data.push(
                {
                  "id":`${link[i].href.toString().match(/\d{12,}/g)}`,
                  "nama":link[i].innerText,
                  "nomer":i
                }
              )
            }
        }
        return data;
    },...link);


    // console.log(groups)
    // await page.waitFor(900000);


console.log(`=> dapet total group : ${groups.length}`.green)
let nomer = await db.has('nomer')?db.get('nomer'):0
await page.goto('https://m.facebook.com',{waitUntil: 'networkidle2'})

})();

```

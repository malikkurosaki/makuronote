# sraping shopee

```js
const puppeteer = require('puppeteer');
const prompt = require('prompt');


// var user,email;
// prompt.get(['username', 'email'], function (err, result) {
//     if (err) { return onErr(err); }
//     user = result.username;
//     email = result.emai;
// });

// console.log(user);

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless:true});
            const page = await browser.newPage();
            await page.goto("https://shopee.co.id/BUSA-ROYAL-FOAM-KUNING-100-x-150-i.114902959.7233104010");
            
            await page.waitForSelector('.flex > .F3D_QV > .\_2MDwq_ > .ZPN9uD > .\_3ZDC1p > .\_2Fw7Qu');
            await page.waitForSelector('.product-briefing > .flex > .flex-auto > .qaNIZv > span')
            await page.waitForSelector('.page-product__content--left > .product-detail > .\_2C2YFD > .\_2aZyWI > .\_2u0jt9')
            await page.waitForSelector('.flex > .\_1eNVDM > .\_1anaJP > .\_3ZDC1p > .\_2JMB9h')

            let urls = await page.evaluate(() => {
               
                var judul = document.querySelectorAll('.product-briefing > .flex > .flex-auto > .qaNIZv > span')[0].innerText.toString();
                var harga = document.querySelectorAll('.flex > .flex > .flex > .flex > .\_3n5NQx')[0].innerText.toString();
                var diskripsi = document.querySelectorAll('.page-product__content--left > .product-detail > .\_2C2YFD > .\_2aZyWI > .\_2u0jt9')[0].innerText.toString();


                
                var dataFotoSampul = document.querySelectorAll('.flex > .\_1eNVDM > .\_1anaJP > .\_3ZDC1p > .\_2JMB9h');
                var fotoSampul = dataFotoSampul[0].getAttribute('style').match(/\"http.*?\"/g).toString().replace(/\"/g,"");


                let fotoProduk = [];
                let fotos = document.querySelectorAll('.flex > .F3D_QV > .\_2MDwq_ > .ZPN9uD > .\_3ZDC1p > .\_2Fw7Qu');
                for(var i = 0;i< fotos.length;i++){
                  var gambar = fotos[i].getAttribute('style')
                  var hasil = gambar.match(/\"http.*?\"/g);
                  fotoProduk.push({
                      "gambar": hasil.toString().replace(/\"/g,"")
                  });
                }
                
                var data = {
                  "judul":judul,
                  "harga":harga,
                  "diskripsi":diskripsi,
                  "fotoSampul":fotoSampul,
                  "fotoProduk":fotoProduk
                }
                return data;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);





/*
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://shopee.co.id/BUSA-ROYAL-FOAM-KUNING-100-x-150-i.114902959.7233104010')
  
  await page.setViewport({ width: 992, height: 682 })
  
  await page.waitForSelector('.product-briefing > .flex > .flex-auto > .qaNIZv > span')
  await page.click('.product-briefing > .flex > .flex-auto > .qaNIZv > span')
  
  await browser.close()
})()
*/

```

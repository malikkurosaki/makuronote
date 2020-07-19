# facebook post 

### package.json

```jason
{
  "name": "puppeteer_projects",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.0",
    "colors": "^1.4.0",
    "copy-paste": "^1.3.0",
    "node-notifier": "^7.0.1",
    "objects-to-csv": "^1.3.6",
    "prompt": "^1.0.0",
    "puppeteer": "^5.0.0",
    "puppeteer-extra": "^3.1.12",
    "puppeteer-extra-plugin-stealth": "^2.4.13",
    "readline-sync": "^1.4.10",
    "simple-json-db": "^1.2.2"
  }
}
```

### posting facebook

```js
const puppeteer = require('puppeteer');
//const groups = require('./list_fb_group_vita.json');
const colors = require('colors');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./db.json');

// posting ke fb group otomatis
console.log('mulai'.blue);

(async () => {
    const browser = await puppeteer.launch(
      {
          headless:false,
          args: ['--no-sandbox'], 
          userDataDir: "./user_vita",
          devtools: true,
          ignoreHTTPSErrors: true
      }
    )
    const page = await browser.newPage()
    
    console.log('=> cari group'.green)
    await page.goto('https://mbasic.facebook.com/groups/?seemore',{waitUntil: 'networkidle2'})
    const link = await page.$x('//a[@href]');
    const groups = await page.evaluate((...link) => {
        let data = [];
        for(var i=0;i<link.length;i++){
            if(link[i].href.includes(link[i].href.toString().match(/\/\d{10,}\?/g))){
            data.push({"id":link[i].href,"nama":link[i].innerText,"nomer":i})
            }
        }
        return data;
    },...link);

    console.log(`=> total group : ${groups.length}`.green)

    let nomer = await db.has('nomer')?db.get('nomer'):0

    for (var i = nomer ;i<groups.length;i++){
        try {
            console.log('-----------------------------------------'.yellow)
            console.log('buka halaman '+groups[i].nama+' id : '+i)
            console.log('-----------------------------------------'.yellow)

            //await page.waitFor(10000000);

            await page.goto(groups[i].id,{ waitUntil: 'networkidle2'})

            // click jualana
            console.log('=> cari tombol jualan'.green)
            // await page.waitForSelector('.cr:nth-child(1) > .m > tbody > tr > .w > .z')
            // await page.click('.cr:nth-child(1) > .m > tbody > tr > .w > .z')
            // `//*[text()[contains(., "Sell Something")]]`
            const jualan = await page.waitForXPath('//*[text()[contains(., "Sell Something")]]',{ waitUntil: 'load', timeout: 1000 });
            jualan.click()

            // isi judul
            console.log('=> isi judul'.green)
            await page.waitForSelector('input[name="composer_attachment_sell_title"]');
            await page.$eval('input[name="composer_attachment_sell_title"]', e => e.value = 
            `
                BISA BAYAR DIRUMAH SETELAH BARANG DITERIMA 💋💋 Karpet rasfur double set 2pcs bantal bulu tidak rontok bisa dicuci lembut halus mewah mempesonah 😍😍
            `
            );

            // isi harga
            console.log('=> isi harga'.green)
            await page.waitForSelector('input[name="composer_attachment_sell_price"]');
            await page.$eval('input[name="composer_attachment_sell_price"]', e => e.value = 100);

            // lokasi
            console.log('=> isi lokasi'.green)
            await page.waitForSelector('input[name="composer_attachment_sell_pickup_note"]');
            await page.$eval('input[name="composer_attachment_sell_pickup_note"]', e => e.value = "Denpasar, Bali, Indonesia");

            // keterangan 
            console.log('=> isi deskripsi'.green)
            await page.waitForSelector('input[name="xc_message"]');
            await page.$eval('input[name="xc_message"]', e => e.value = 
            `
                READY STOCK SIAP KIRIM 
                BISA BAYAR DIRUMAH SETELAH BARANG DITERIMA

                WA 087760426664

                KWALITAS NO KALENG2

                1. Kami memakai ALAS BINTIK SUPER yg kuat dan tidak mudah sobek. Sedangkan toko lain pakai alas bintik BIASA/FURING.

                2. Kami pakai rasfur jenis karindo.. yaitu merk rasfur terbaik kualitas nya serta tidak mudah rontok. Sedangkan toko lain pakai rasfur lokal yg gampang rontok bulu nya.

                3. Kami pakai busa ROYAL warna kuning dengan ketebalan FULL 1cm. Sedangkan toko lain ada yg pakai busa 0,8cm dan ada yg pakai busa putih seperti gabus/streofoam.

                Buktikan kwalitas produk kami.
                kualitas alas BINTIK SUPER gak mudah robek. Dijamin paling top dan awet. Dan BUSA ROYAL YELLOW bukan busa abal2 kaya gabus/stereofoam ya..

                Ada harga ada kualitas ya. jangan bandingkan dengan yang lebih murah lagi karena jelas BEDA BAHAN DAN KUALITASNYA


                Jahitan rapi dan berkelas.. bahan baku yang berkwalitas.
            `
            );


            // // pilih gambar 1
            // const [fileChooser] = await Promise.all([
            //     page.waitForFileChooser(),
            //     page.click('input[name="file1"]')
            // ]);
            // await fileChooser.accept([path.join(__dirname,'/images/a1.png')]);
           
            const gambar1  = await page.$('input[name="file1"]');
            await gambar1.uploadFile(path.join(__dirname,'/images/rasfur2.jpg'))
            
            //pause
            //await page.waitFor(90000000);

            console.log('=> coba posting'.green)
            await page.waitForSelector('input[type="submit"]');
            await page.click('input[type="submit"]');
            
            // tunggu selesai
            await page.waitForSelector('input[value="Mark as Sold"]');
            //await page.waitForNavigation({waitUntil: 'load',timeout: 20000});

            console.log('**************************************************'.blue)
            console.log('  BERHASIL POST KE  : '+groups[i].nama+' id : '+i)
            console.log('**************************************************'.blue)

            notifier.notify({
                title: 'POSTINGAN BERHASIL',
                message:'posting ke '+groups[i].nama+"\n *** SELESAI ***",
                icon: path.join(__dirname, './icons/fb.png'),
                sound:'Glass'
            });
            db.set('nomer', i);
        } catch (e) {
            console.log('************************************************'.red)
            console.log('xxx  GAGAL  xxx\n=>'+e)
            console.log('************************************************'.red)

            notifier.notify({
                title: 'POSTINGAN GAGAL',
                message:'posting ke '+groups[i].nama+"\n xxx GAGAL xxx",
                icon: path.join(__dirname, './icons/gagal.png'),
                sound:'Basso'
            });
            i++;
        }
    }
    
})();

```

### tambah group

``` js
const puppeteer = require('puppeteer');
const groups = require('./list_fb_group.json');
const colors = require('colors');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');
const property = require('./fb_lite_property');

// posting ke fb group otomatis
(async () => {
    const q = 'singaraja'
    const url = `https://mbasic.facebook.com/search/groups/?q=`+q
    const browser = await puppeteer.launch(
      {
          headless:false,
          args: ['--no-sandbox'], 
          userDataDir: "./user_data2",
          devtools: true,
          ignoreHTTPSErrors: true
      }
    )
    const page = await browser.newPage()

    await page.goto(url,{waitUntil:'networkidle2'})

    var hasil = []
    var berapa = await name(page)
    var tambah = 0;
    while (tambah < berapa.length) {
        await page.goto(berapa[tambah],{waitUntil:'networkidle2'})
        tambah++;
    }
    console.log('selesai semua')

})();

async function name(page) {
    var jalan = true;
    hasil = []
    while (jalan) {
        try {
            await page.waitForXPath('//a[contains(@href, "/join/")]',{ waitUntil: 'load', timeout: 1000 });
            const link = await page.$x('//a[contains(@href, "/join/")]');
            const links = await page.evaluate((...link) => {
                return link.map((item) => item.href)
            },...link);
            hasil.push(...links)
            const more = await page.waitForXPath('//*[text()[contains(.,"See more results")]]');
            more.click();
            await page.waitForNavigation({waitUntil: 'networkidle2'});
            
        } catch (error) {
            console.log('selesai'+error)
            jalan = false;
            return hasil;
        }
    }
    
}
```

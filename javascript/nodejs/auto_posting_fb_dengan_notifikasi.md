# auto posting fb dengan notifikasi

```js
const puppeteer = require('puppeteer');
const group = require('./list_fb_group.json');
const colors = require('colors');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');

// posting ke fb group otomatis

(async () => {

  const groups = group;

  const gambar = 
  [
    "/Users/probus/Downloads/jbl.jpeg"
  ];

  const browser = await puppeteer.launch(
      {
          headless:false,
          args: ['--no-sandbox'], 
          userDataDir: "./user_data",
          //devtools: true,
          ignoreHTTPSErrors: true
      }
  )
  const page = await browser.newPage()
  //await page.setViewport({ width: 1433, height: 667 })

  for (var i = 165 ;i<groups.length;i++){
    try {
      console.log(colors.blue('coba posting ke group '+groups[i].nama))
      await page.goto('https://web.facebook.com/groups/'+groups[i].id,{ waitUntil: 'networkidle2' })

      // await page.waitForSelector('.\_1tm3 > div > #js_5 > .\_4-fs > .\_5qtp')
      // await page.click('.\_1tm3 > div > #js_5 > .\_4-fs > .\_5qtp')
      
      // // click isi judul
      // console.log('klik kolon jual beli')
      // await page.waitForSelector('input.\_58al')
      // await page.click('input.\_58al')

      // apa yang kamu jual
      console.log('isi judul'.yellow)
      await page.waitForSelector('input[placeholder="What are you selling?"]');
      await page.click('input[placeholder="What are you selling?"]')
      //await page.focus('input[placeholder="What are you selling?"]')
      await page.keyboard.type('Handsfree Bluetooth JBL TWS4')
      

      // harga item
      console.log('isi harga'.yellow)
      await page.waitForSelector('input[placeholder="Price"]');
      await page.click('input[placeholder="Price"]')
      //await page.focus('input[placeholder="Price"]')
      await page.keyboard.type('150000')

      //'input[placeholder="Add Location (optional)"]'
      console.log('input lokasi'.yellow)
      await page.waitForSelector('input[placeholder="Add Location (optional)"]')
      //await page.click('input[placeholder="Add Location (optional)"]')
      //await page.focus('input[placeholder="Add Location (optional)"]')
      await page.$eval('input[placeholder="Add Location (optional)"]', elements => elements.value = "Denpasar, Bali, Indonesia");


      // deskribsi
      console.log('membuat descripsi'.yellow)
      await page.waitFor('.\_5rpb > .notranslate > div > div > .\_1mf');
      await page.click('.\_5rpb > .notranslate > div > div > .\_1mf')
      //await page.focus('.\_5rpb > .notranslate > div > div > .\_1mf')
      await page.keyboard.type(
        `
        WA : 087760426664
        note : bisa COD / bayar ditempat ya .. jadi barang dikirim dl baru bayar
        Deskripsi Handsfree Bluetooth JBL TWS4
        Headset Bluetooth Sport JBL By Harman TWS-4 Wireless Earphone JBL TWS4 TWS 4

        READY : HITAM

        Headset ini memiliki desain yang sangat simple dan sporty.
        SUARA NGE BASS Teknologi Pure Bass Performace
        Teknologi True Wirelless Sound ( tidak pakai kabel lagi antara headset kiri dan kanan )
        Koneksi wireless via bluetooth membuat headset ini sangat nyaman digunakan tanpa adanya kabel yang menggangu. 
        Bisa digunakan di handphone mana saja ( IOS dan ANDROID )
        Ada Mic Bisa Buat Telp
        Tombol Touch Screen play / answer call

        FITUR
        - Bisa Konek 2 hp sekaligus
        - Built in Microphone = BISA UNTUK TELP
        - Jarak 10meter
        - Tombol Touch
        - Bluetooth True Wireless version 5
        - Compatible dengan semua perangkat android atau ios
        - Standby time up to 24 hours
        - Music up to 5 hours (tergantung volume)

        Kelengkapan ( SEPERTI DI FOTO ASLI ) :
        - Headset
        - Kabel Charger

        Kami punya stock yang banyak dan ready sehingga bisa dikirim pada hari yang sama. Thx
        `
      )

      // isi gambar
      console.log('input gambar'.yellow)
      await page.waitForSelector('input[type=file]');
      const inputUploadHandle = await page.$('input[type=file]');
      
      for(let i = 0;i<gambar.length;i++){
        inputUploadHandle.uploadFile(gambar[i]);
      }

      // clik submit
      console.log('submit')
      await page.waitFor(5000);
      await page.waitForSelector('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
      await page.focus('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
      await page.click('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
    

     
      //
      await page.waitFor(5000);

      // cari market place ( gk diikutkan ) bikin ke banned spam
        console.log('cek market place'.yellow)
        await page.waitForSelector('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6')
        var market = await page.$eval('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6', e => e.getAttribute("aria-checked"));
        if(market){
          await page.click('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
        }

        var market = await page.$eval('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6', e => e.getAttribute("aria-checked"));
        if(market){
          await page.click('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
        }

        var market = await page.$eval('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6', e => e.getAttribute("aria-checked"));
        if(market){
          await page.click('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
        }



        //klik untuk posting
        console.log('posting ke group')
        await page.waitForSelector('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        await page.focus('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        await page.click('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        await page.waitFor(10000);
        console.log(colors.green('posting ke '+groups[i].nama+ " selesai id : "+i))
        notifier.notify({
          title: 'POSTINGAN BERHASIL',
          message:'posting ke '+groups[i].nama+ " SELESAI id : "+i,
          icon: path.join(__dirname, './icons/fb.png'),
          sound:'Glass'
        });
      

    } catch (error) {

      // terjadi error biasanya karena group bukan untuk jual beli .. maka next
      console.log(`${groups[i].nama} > bukan group jual beli \n ${error}`.red)
      notifier.notify({
        title: 'POSTINGAN GAGAL',
        message:'posting ke '+groups[i].nama+ "\n GAGAL note : \n"+error,
        icon: path.join(__dirname, './icons/gagal.png'),
        sound:'Basso'
      });
      i++;
      await page.waitFor(1000);
    }
  }
  
  
  await browser.close()
})()

```

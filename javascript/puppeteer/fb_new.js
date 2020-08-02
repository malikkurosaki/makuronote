const puppeteer = require('puppeteer-extra')
const colors = require('colors')
const chalk = require('chalk')
const notifier = require('node-notifier')
const path = require('path')
const fs = require("fs")

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// untuk usernya
const user = 'cinta'
const groups = require('./db/'+user+'/list_fb_group.json')
const konten = require('./db/'+user+'/konten.json')
const sudah = require('./db/'+user+'/db_sudah.json')

var gambars = fs.readdirSync(path.join(__dirname,'images'), file => file)

// posting ke fb group otomatis
;(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./akun/user_"+user,
  })

  // sortis group
  const lsGroup = groups.filter((gr) => !sudah.map( el => el.nama).includes(gr.nama) && gr.jualBeli)
  
  const page = await browser.newPage();

  for (let i = 0; i < lsGroup.length; i++) {
    let berapa = sudah.length
    if(berapa % 100 == 0){
      console.log(`sudah posting ke ${berapa.toString().yellow} , istirahat dulu`.magenta)
    }
    try {
      await page.goto('https://web.facebook.com/groups/'+lsGroup[i].id);
      await page.waitForSelector('input[placeholder="What are you selling?"]',{waitUntil: 'networkidle2', timeout: 5000});
      await page.click('input[placeholder="What are you selling?"]')
      await page.focus('input[placeholder="What are you selling?"]')
      await page.waitFor(2000);
      await page.keyboard.type(konten.judul)
      
      // masukkan harga item
      console.log(' => coba isi harga'.blue)
      await page.waitForSelector('input[placeholder="Price"]');
      await page.click('input[placeholder="Price"]')
      await page.focus('input[placeholder="Price"]')
      await page.keyboard.type(konten.harga.toString())

      // memasukkan dekripsi atau keterangan
      console.log('=> membuat descripsi'.blue)
      await page.waitFor('.\_5rpb > .notranslate > div > div > .\_1mf');
      await page.click('.\_5rpb > .notranslate > div > div > .\_1mf')
      await page.focus('.\_5rpb > .notranslate > div > div > .\_1mf');
      await page.keyboard.sendCharacter(konten.keterangan);

      // isi gambar
      console.log('=> input gambar'.blue)
      await page.waitForSelector('input[title="Choose a file to upload"]');
      const inputUploadHandle = await page.$('input[title="Choose a file to upload"]');

      for(let x = 0;x<gambars.length;x++){
        console.log('coba gambar ' + gambars[x])
        await inputUploadHandle.uploadFile(path.join(__dirname,`images/${gambars[x]}`));
      }

      // clik submit
      console.log('submit')
      await page.waitFor(8000);
      await page.waitForSelector('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
      await page.focus('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
      await page.click('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')

      await page.waitFor(2000);
    // cek ada centang apa gk
      console.log('cek market place'.yellow)
      await page.waitForSelector('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
      var apa = await page.evaluate(() => {
        var a = document.querySelector('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6')
        return a.getAttribute('aria-checked')
      });

      // kl tercentang maka klick lagi
      if(apa.toString() === "true"){
        console.log('contang market true')
        await page.waitFor(2000);
        try {
          console.log('coba gk ikut market place')
          await page.waitForSelector('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
          await page.click('.uiList > li:nth-child(2) > .\_4ofi > .\_4ofr > .\_kx6');
          console.log('gk ikut market place => berhasil')
        } catch (error) {
          console.log('gak ikut market place =>  gagal')
        }
      }else{
        console.log(apa)
      }

      await page.waitForSelector('.uiList > li:nth-child(4) > .\_4ofi > .\_4ofr > .\_kx6')
      const link = await page.evaluate((...sudah) => {
        const a = document.querySelectorAll("div > div > div > ul > ul > li")
        var hasil = []
        for(let y = 4; y< a.length;y++){
          hasil.push(
            {
              "nama":a[y].innerText,
              "nomer":y
            }
          )
        }

        return sudah.length == 0 ? hasil.slice(0,9) : hasil.filter( e => !sudah.map( x => x.nama).includes(e.nama)).slice(0,9)
      },...sudah);
      
      // console.log(link)

      try {
        for (let s = 0; s < link.length; s++) {
          console.log('coba click '+ link[s].nomer)
          await page.waitForSelector('.uiList > li:nth-child('+link[s].nomer+') > .\_4ofi > .\_4ofr > .\_kx6')
          await page.click('.uiList > li:nth-child('+link[s].nomer+') > .\_4ofi > .\_4ofr > .\_kx6');
          await page.waitFor(1000);
        }
      } catch (error) {
        console.log(error)
      }
      

      // klik untuk posting
      try {
        console.log('posting ke group')
        await page.waitForSelector('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        await page.focus('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        await page.click('.\_ohf > .\_2ph- > .\_332r > span > .\_1mf7')
        console.log('posting ke grup berhasil')
      } catch (error) {
        console.log('posting ke group gagal')
        console.log(error)
      }

      // coba enter
      try {
        console.log('coba enter');
        await page.keyboard.press('Enter');
        console.log('enter berhasil')
      } catch (error) {
        console.log('enter gagal')
        console.log(error)
      }
      await page.waitFor(10000);

      // cari postingan yang sudah diposting
      const sukses = await page.$x("//span[contains(text(), '"+lsGroup[i].judul+"')]");

      // simpan ingatan
      sudah.push(
        {
          "nama": lsGroup[i].nama,
          "nomer": 'induk'+ i,
          "judul": konten.judul
        }
      )

      // simpan data
      console.log('coba simapan yang sudah'.yellow)
      sudah.push(...link)
      await fs.writeFile('./db/'+user+'/db_sudah.json', JSON.stringify(sudah,null,4), 'utf8',()=>{});
      
      // beritahu jika berhasil
      notifier.notify({
        title: 'POSTINGAN BERHASIL',
        message:'posting ke '+ lsGroup[i].nama,
        icon: path.join(__dirname, './icons/fb.png'),
        sound:'Glass'
      });

      console.log(`misi sukses => total postingan ${sudah.length}`.green)

    } catch (error) {
      // beritahu jika berhasil
      notifier.notify({
        title: 'POSTINGAN GAGAL',
        message:'posting ke ',
        icon: path.join(__dirname, './icons/fb.png'),
        sound:'Ping'
      });
      console.log(error)
      await page.waitFor(1000);
      i++;
    }
  }

  console.log(`semua berhasil diposting total ${sudah.length} postingan`.green)

  await browser.close();
})();
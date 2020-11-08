# chorium terpisah

```js
const puppeteer = require('puppeteer-core');
const db = require('./database');

const tunggu = {waitUntil: 'networkidle2', timeout: 5000}
const alamat1 = "https://mbasic.facebook.com/groups/?seemore&refid=27";
const alamat2 = 'https://www.facebook.com/groups/668478317394189';
const alamat3 = "https://mbasic.facebook.com/search/groups/?q=denpasar"

async function pages(alamat){
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./akun/user/malik",
    devtools: true,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox"],
    executablePath: '/Users/probus/Documents/projects/Chromium.app/Contents/MacOS/Chromium',
    defaultViewport: {
      width: 500,
      height: 720,
    }
  })

  const pages = await browser.pages();
  const page = pages[0]
  await page.goto(alamat);
  await page.waitForTimeout(3000);
  return page;
}


// poting
;async function posting(alamat){
  const page = await pages(alamat);
  await page.$x("//span[contains(text(), 'Jual Sesuatu')]",tunggu).then(e => e[0].click())
  await page.waitForTimeout(4000);

  // upload gambar
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('.n1l5q3vz > .aov4n071 > div > .oajrlxb2 > .bp9cbjyn'), // some button that triggers file selection
  ]);
  await fileChooser.accept(['/Users/probus/Documents/IMG_20201015_105412.jpg']);

  // judul
  const judul = await page.$x("//span[contains(text(), 'Judul')]",tunggu).then(e => e[0].click());
  await page.keyboard.type('apa kabarnya');

  // hahrga
  const harga = await page.$x("//span[contains(text(), 'Harga')]",tunggu).then(e => e[0].click());
  await page.keyboard.type('5000');

  // kondisi
  const kondisi = await page.$x("//span[contains(text(), 'Kondisi')]",tunggu).then(e => e[0].click());
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter');


  // keterangan
  const ket = await page.$x("//textarea",tunggu).then(e => e[0].click());
  await page.keyboard.type('ini adalah keterangannya');
  await page.waitForTimeout(2000)


  // selanjutnya
  const selanjutnya = await page.$x("//span[contains(text(), 'Selanjutnya')]",tunggu).then(e => e[0].click());
  await page.waitForTimeout(3000)
  
  // LAPAK JUAL BELI BALI
  const klik1 = await page.$x('//span[contains(text(), "LAPAK JUAL BELI BALI")]',tunggu).then(e => e[0].click())

};



// lihat semua group yang dipunyai
async function lihatGroup(alamat) {
  const sudah = []
  const page = await pages(alamat);
  await page.waitForTimeout(1000)

  const link = await page.evaluate((...sudah) => {
    const a = document.querySelectorAll("table > tbody > tr > td > a")
    var hasil = []
    for(let y = 1; y< a.length;y++){
      console.log(a[y]+ "ini ada dimana");
      if(a[y].href.includes("https://m.facebook.com/groups/")){
        hasil.push(
          {
            "nama":a[y].innerText,
            "alamat": a[y].href,
            "nomer":y
          }
        )
      }
     
    }
    return hasil;
    //return sudah.length == 0 ? hasil.slice(0,9) : hasil.filter( e => !sudah.map( x => x.nama).includes(e.nama)).slice(0,9)
  },...sudah);

  page.close()
  return link;
  
}



// cari gabung group
async function tambahGroup(alamat){
  const page = await pages(alamat);
  const sudah = []
  const berapa = 100

  for(var x = 0; x < berapa; x++){
    try {
      const link = await page.evaluate( async (...sudah) => {
        const a = document.querySelectorAll("table > tbody > tr > td > div > a")
        var hasil = []
        for(let y = 1; y< a.length;y++){
          if(a[y].innerText == "Gabung"){
            hasil.push(
              {
                "nama":a[y].innerText,
                "alamat": a[y].href,
                "nomer":y
              }
            )
          }
        }
        return hasil;
        //return sudah.length == 0 ? hasil.slice(0,9) : hasil.filter( e => !sudah.map( x => x.nama).includes(e.nama)).slice(0,9)
      },...sudah);

      sudah.push(...link)
      await page.$x('//span[contains(text(),"Lihat Hasil Selanjutnya")]').then( e => {e[0].click()});
      await page.waitForTimeout(2000)
      console.log(`lanjut ${x}`)
    } catch (error) {
      x = 100;
      console.log("selesai");
    }
  }

  for(var i = 0; i < sudah.length; i++){
    if(i < 10){
      await page.goto(sudah[i]['alamat'])
      console.log("minta ke"+ sudah[i]['alamat'])
      await page.waitForTimeout(1000)
    }else{
      i =  sudah.length
      console.log('selesai')
    }
  }
} 

module.exports = {
    lihatGroup : async () => { return await lihatGroup(alamat1)}
}
```

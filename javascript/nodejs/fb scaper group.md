# fb scaper group

```javascript
const puppeteer = require('puppeteer');
var colors = require('colors');

(async () => {

  const groups = [
    {
      "nama":"vespa",
      "id":"1505729313076265"
    },
    {
      "nama":"buka lapak denpasar",
      "id":"123480811620379"
    },
    {
      "nama":"jual beli denpasar",
      "id":"2043297962592446"
    },
    {
      "nama":"olx denpasar",
      "id":"1948352345424945"
    },
    {
      "nama":"jual beli hp denpasar",
      "id":"1926650454034650"
    }

  ]

  const gambar = 
  [
    "/Users/probus/Downloads/tas1.jpg",
    "/Users/probus/Downloads/tas2.jpg"
  ];

  //await page.setViewport({ width: 1433, height: 667 })

  const browser = await puppeteer.launch(
      {
          headless:false,
          args: ['--no-sandbox'], 
          userDataDir: '/tmp/myChromeSession'
      }
  )
  const page = await browser.newPage()

  for(var i=0;i<groups.length;i++){
    console.log(colors.red('coba posting ke group '+groups[i].nama))

    await page.goto('https://web.facebook.com/groups/'+groups[i].id,{ waitUntil: 'networkidle2' })
    
    // clik pertama
    await page.waitForSelector('.\_1tm3 > div > #js_5 > .\_4-fs > .\_5qtp')
    await page.click('.\_1tm3 > div > #js_5 > .\_4-fs > .\_5qtp')
    
    // click isi judul
    await page.waitForSelector('input.\_58al')
    await page.click('input.\_58al')

    // apa yang kamu jual
    await page.waitForSelector('input[placeholder="What are you selling?"]');
    await page.focus('input[placeholder="What are you selling?"]')
    await page.keyboard.type('tas murah meriah')
    

    // harga item
    await page.waitForSelector('input[placeholder="Price"]');
    await page.focus('input[placeholder="Price"]')
    await page.keyboard.type('200000')

    // deskribsi
    await page.waitFor('.\_5rpb > .notranslate > div > div > .\_1mf');
    await page.click('.\_5rpb > .notranslate > div > div > .\_1mf')
    await page.focus('.\_5rpb > .notranslate > div > div > .\_1mf')
    await page.keyboard.type('minat inbox')

    // isi gambar
    await page.waitForSelector('input[type=file]');
    const inputUploadHandle = await page.$('input[type=file]');
    
    for(let i = 0;i<gambar.length;i++){
      inputUploadHandle.uploadFile(gambar[i]);
    }

    await page.waitForSelector('.\_4-u3 > .\_332r > span > .\_4jy1 > span');
    await page.waitFor(8000);
    await page.click('.\_4-u3 > .\_332r > span > .\_4jy1 > span')

    await page.waitForSelector('.\_1mf7 > span');
    await page.waitFor(5000);
    await page.keyboard.press('Enter');
    await page.waitFor(5000);

    console.log(colors.green('posting ke '+groups[i].nama+ "selesai id : "+i))
    


    // await page.on('dialog', async dialog => {
    //     await dialog.accept();
    // });

  
  }
  
  
  await browser.close()
})()

// (async () => {
//   const browser = await puppeteer.launch(
//       {
//           headless:false,
//           args: ['--no-sandbox'], 
//           userDataDir: '/tmp/myChromeSession'
//       }
//   )
//   const page = await browser.newPage()
  
//   const navigationPromise = page.waitForNavigation()
  
//   //await page.goto('https://web.facebook.com/login',{waituntil:"networkidle2"})

  
// //   await page.waitForSelector('#email')
// //   await page.$eval('#email', (el,value) => el.value = "maliksekeluarga@gmail.com");
  
// //   await page.waitForSelector('#pass')
// //   await page.$eval('#pass', (el,value) => el.value = "makuro123" );
  
// //   await page.waitForSelector('._39il ._52e0')
// //   await page.click('._39il ._52e0')
  
// //   await page.waitForNavigation();

//   await await page.goto('https://web.facebook.com/groups/123480811620379/yourposts/?availability=available&referral_surface=group_mall_header_nav',{waitUntil:"networkidle2"});
    
//   await page.setViewport({ width: 1433, height: 707 })

//   // memunculkan list group
//   await page.waitForSelector('#mall_post_639334620034993 > .clearfix > .\_4bl9 > .\_14h8 > div > .clearfix > .\_4bl7 > .\_42ft:nth-child(2)')
//   await page.click('#mall_post_639334620034993 > .clearfix > .\_4bl9 > .\_14h8 > div > .clearfix > .\_4bl7 > .\_42ft:nth-child(2)')
  
//   await page.waitForSelector('.\_2xp4:nth-child(1) > .\_2pi0 > .\_1agb > .\_1ag3 > .\_1ag4 > .\_1ag7')
//   await page.click('.\_2xp4:nth-child(1) > .\_2pi0 > .\_1agb > .\_1ag3 > .\_1ag4 > .\_1ag7')
// //   let apanya = await page.evaluate(() => {
// //       let pilih = document.querySelectorAll('.\_2xp4');
// //       return pilih.length;
// //   });

//    for(var i = 1;i<12;i++){
//        await page.waitForSelector(`.\_2xp4:nth-child(${i}) > .\_2pi0 > .\_1agb > .\_1ag3 > .\_1ag4 > .\_1ag7`)
//        await page.click(`.\_2xp4:nth-child(${i}) > .\_2pi0 > .\_1agb > .\_1ag3 > .\_1ag4 > .\_1ag7`)
//    }
//   //await browser.close()
// })()

```

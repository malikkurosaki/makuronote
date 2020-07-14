# ambil data group fb 

```js
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const colors = require('colors');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch(
        {
            headless:false,
            args: ['--no-sandbox'], 
            userDataDir: "./user_data",
            devtools: true,
            ignoreHTTPSErrors: true
        }
    )
  const page = await browser.newPage()
  
  await page.goto('https://www.facebook.com/groups/?category=membership',
    { 
      waitUntil: 'networkidle2' 
    }
  )
  await page.waitForSelector('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')

  var jalan = true;
  while (jalan) {
    try{
        await page.waitForSelector('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')
        page.$eval('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span', (el) => el.scrollIntoView())
        await page.click('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')
        console.log("buka > list group".green)
        
    }catch(e){
        console.log("stop > terakhir list group".red)
        jalan = false;
    }
    console.log("tunggu ...".blue)
  }
    
    console.log('coba ambil data id dan nama group')
    var groupData = await page.evaluate(() => {
      var totalGroup = document.querySelectorAll('#js_0 > div > div > div:nth-child(5) > div._2fvv > div')
      var dataGroup = []
      for(var i=1;i<totalGroup.length;i++){
        var elem = document.querySelector(`#js_0 > div > div > div:nth-child(5) > div._2fvv > div:nth-child(${i}) > a`)
        console.log()
        dataGroup.push(
          {
            "id":`${elem.href.toString().match(/\d+/g)}`,
            "nama":elem.innerText
          }
        )
      }
      return dataGroup;
    });

    console.log('menyimpan hasil data group di list_fb_group.json'.yellow)
    fs.writeFile('list_fb_group.json', JSON.stringify(groupData,null,4), 'utf8',()=>{
      console.log('           '.bgGreen)
      console.log('  berhasil '.bgGreen)
      console.log('           '.bgGreen)
    });
    await browser.close()
})()
```

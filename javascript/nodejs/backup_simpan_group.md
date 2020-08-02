# backup simpan group

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
            userDataDir: "./user_vita",
            devtools: true,
            ignoreHTTPSErrors: true
        }
    )
  const page = await browser.newPage()
  
  await page.goto('https://mbasic.facebook.com/groups/?seemore',{waitUntil: 'networkidle2'})
  const link = await page.$x('//a[@href]');
  const links = await page.evaluate((...link) => {
      let data = [];
      for(var i=0;i<link.length;i++){
        if(link[i].href.includes(link[i].href.toString().match(/\/\d{10,}\?/g))){
          data.push({"id":link[i].href,"nama":link[i].innerText,"nomer":i})
        }
      }
      return data;
  },...link);

  console.log(links)


  // await page.waitForSelector('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')

  // var jalan = true;
  // while (jalan) {
  //   try{
  //       await page.waitForSelector('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')
  //       page.$eval('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span', (el) => el.scrollIntoView())
  //       await page.click('.\_2fvv > a > .\_3qn7 > .jxbw8zu1 > span')
  //       console.log("buka > list group".green)
        
  //   }catch(e){
  //       console.log("stop > terakhir list group".red)
  //       jalan = false;
  //   }
  //   console.log("tunggu ...".blue)
  // }
    
  //   console.log('coba ambil data id dan nama group')
  //   var groupData = await page.evaluate(() => {
  //     var totalGroup = document.querySelectorAll('#js_0 > div > div > div:nth-child(5) > div._2fvv > div')
      
  //     var dataGroup = []
  //     for(var i=1;i<totalGroup.length;i++){
  //       var elem = document.querySelector(`#js_0 > div > div > div:nth-child(5) > div._2fvv > div:nth-child(${i}) > a`)
  //       console.log(elem.href)
  //       dataGroup.push(
  //         {
  //           "id":`${elem.href.toString().match(/\d+/g)}`,
  //           "nama":elem.innerText
  //         }
  //       )
  //     }
  //     return dataGroup;
  //   });
  //   console.log(`total : ${groupData.length}`)
  //   console.log('menyimpan hasil data group di list_fb_group.json'.yellow)
  //   fs.writeFile('list_fb_group_vita.json', JSON.stringify(groupData,null,4), 'utf8',()=>{
  //     console.log('           '.bgGreen)
  //     console.log('  berhasil '.bgGreen)
  //     console.log('           '.bgGreen)
  //   });
  //   await browser.close()
})()
```

# whatsapp login

```js
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './malik',
        ignoreHTTPSErrors: true,
        args: [`--window-size=720,720`],
        defaultViewport: {
            width: 720,
            height: 720
        }
    })
    const page = await browser.newPage()
    await page.goto('https://web.whatsapp.com/')
    
    //await page.setViewport({ width: 720, height: 540 })
    
   if(!fs.existsSync('./malik')){
        const example = await page.evaluate(element => {
            return element.getAttribute('data-ref');
        }, (await page.$x('//*[@id="app"]/div[1]/div/div[2]/div[1]/div/div[2]/div'))[0]);
        
        qrcode.generate(example, {small: true});

        var ulang = true;

        for(var a = 0; a < 10 ; a++){
            if(ulang){
                try {
                    await page.waitForTimeout(5000);
        
                    const example2 = await page.evaluate(element => {
                        return element.getAttribute('data-ref');
                    }, (await page.$x('//*[@id="app"]/div[1]/div/div[2]/div[1]/div/div[2]/div'))[0]);
        
                    if(example2 != null){
                        qrcode.generate(example2, {small: true});
                        ulang = false;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            
        }
   }
    
  
})();
```

```js
"--log-level=3",
		"--no-default-browser-check",
		"--disable-site-isolation-trials",
		"--no-experiments",
		"--ignore-gpu-blacklist",
		"--ignore-certificate-errors",
		"--ignore-certificate-errors-spki-list",
		"--disable-extensions",
		"--disable-default-apps",
		"--enable-features=NetworkService",
		"--disable-setuid-sandbox",
		"--no-sandbox",
		"--disable-infobars",
		"--window-position=0,0",
		"--ignore-certifcate-errors",
		"--ignore-certifcate-errors-spki-list",
		"--disable-threaded-animation",
		"--disable-threaded-scrolling",
		"--disable-histogram-customizer",
		"--disable-composited-antialiasing",
		"--disable-dev-shm-usage",
		"--disable-notifications"
   ```

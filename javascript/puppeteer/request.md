# request

```js
const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const { CheckLogin } = require('./check_login');
const { SelectContent } = require('./select_content');
const puppeteer = require('puppeteer');
const fs = require('fs');
async function Posting() {

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=500,720',
        ]
    });

    const [page] = await browser.pages();
    page.setViewport({
        width: 500,
        height: 720
    });


    const contentHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>Halo Apa kAbarnya</h1>
        <button >tekan</button>
    </body>
    <script>

        const btn = document.querySelector("button");
        btn.addEventListener("click", function () {
            console.log("apa")
        });
    </script>
    </html>
    `
    const file = fs.readFileSync('./lib/index.html', 'utf8');
    // await page.setContent(contentHtml);
    await page.goto('https://mbasic.facebook.com')
    page.on('request', async req => {
        console.log(req.postData());
    });

    // page.on('response', async res => {
    //     console.log(res.url().yellow);
    // });

    page.on('console', req => {
        console.log(req.text())
    });
    // let hasLogin = await  CheckLogin()

    // let content = await SelectContent();

    // console.log(content)
}

module.exports = { Posting };
```

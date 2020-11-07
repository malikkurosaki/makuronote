# upload agambar

```javascript
const puppeteer = require('puppeteer');
// const iPhone = puppeteer.devices['iPhone X'];
const tunggu = {waitUntil: 'networkidle2', timeout: 5000}

;(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./akun/user/malik",
    devtools: true,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 500,
      height: 700,
      //isMobile: true,
    }
  })

  const pages = await browser.pages();
  const page = pages[0]
  await page.goto('https://www.facebook.com/groups/668478317394189');
  await page.waitForTimeout(3000);

  const jual = await page.$x("//span[contains(text(), 'Jual Sesuatu')]",tunggu);
  await jual[0].click();
  await page.waitForTimeout(4000);

  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('.n1l5q3vz > .aov4n071 > div > .oajrlxb2 > .bp9cbjyn'), // some button that triggers file selection
  ]);
  await fileChooser.accept(['/Users/probus/Documents/IMG_20201015_105412.jpg','/Users/probus/Documents/IMG_20201015_105412.jpg','/Users/probus/Documents/IMG_20201015_105412.jpg']);

```

```js
const puppeteer = require('puppeteer-core')

;(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const page = await browser.newPage()
  await page.goto('https://example.com')
  await page.screenshot({ path: 'example.png' })

  await browser.close()
})()
```

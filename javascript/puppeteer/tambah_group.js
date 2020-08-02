const puppeteer = require('puppeteer-extra')
const colors = require('colors')
const chalk = require('chalk')
const notifier = require('node-notifier')
const path = require('path')
const JSONdb = require('simple-json-db')
const fs = require("fs")
const groups = require('./db/list_fb_group.json')
const konten = require('./db/konten.json')
const sudah = require('./db/db_sudah.json')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const options = {
    headless: false,
    userDataDir: "./akun/user_vita",
}
const namaGroup = 'tabanan'

;(async () => {
    const browser = await puppeteer.launch(options);
    const [page] = await browser.pages()
    await page.goto('https://web.facebook.com/search/groups/?q=' + namaGroup,{waitUntil: 'networkidle2'});

    for ( var i = 0 ; i < 100 ; i++) {

        try {
            console.log('scroll')
            await page.evaluate(() => {
                window.scrollBy(0, 1280);
            });
            await page.waitFor(1000);
            await page.waitForSelector('#browse_end_of_results_footer',{waitUntil: 'networkidle2',timeout: 1000});
            i = 101
            console.log('selesai')
        } catch (error) {
            i++;
        }
        console.log(i)
    }

    const link = await page.$x('//a[contains(text(), "Join")]');
    const joins = await page.evaluate((...link) => {
       return link.map( el => `${el.getAttribute('ajaxify').match(/\d{10,}/g)}`)
    },...link);
    console.log(joins)
    for( var i = 0; i < joins.length; i++){
        try {
            console.log('menuju group '+joins[i])
            await page.goto('https://web.facebook.com/groups/'+ joins[i],{waitUntil: 'networkidle2'});
            await page.waitForSelector('#joinButton_'+joins[i],{waitUntil: 'networkidle2'})
            await page.click('#joinButton_'+joins[i],{waitUntil: 'networkidle2'})
            await page.waitFor(5000);
            console.log('minta bergabung ke group '+joins[i])
            console.log('next'.yellow)
        } catch (error) {
            console.log('ada kesalahan di '.red)
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

        //var area = await page.$$('textarea[placeholder="Write your answer..."]');
        
    }
    console.log('selesai , sudah dimintain semua '.green)


})()
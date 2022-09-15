```js
#!/usr/bin/env node
// get flag
const params = process.argv.slice(2);
if (params.length > 0) {
    if (params[0] == "install") {
        require('child_process').execSync(`npm i crypto-js javascript-obfuscator colors`, { stdio: "inherit" });
        console.log("install success");
        return;
    } else {
        console.log("menu itu belum saya buatin , mungkin next");
        return;
    }

} else {
    main();
}


var CryptoJS = require("crypto-js");
const fs = require('fs');
const path = require('path');
const obf = require('javascript-obfuscator');
const colors = require('colors');

function main() {
    const listMenu = ["encrypt", "decrypt", "builder"]
    require('prompts')({
        type: "autocomplete",
        name: "menu",
        message: "pilih",
        choices: listMenu.map(e => {
            return {
                title: e,
                value: e
            }
        })
    }).then(({ menu }) => {
        if (!menu) return console.log("ok, bye..");
        eval(`${menu}()`)
    })

}

function encrypt() {
    const pathFile = path.parse('./xmakuro');
    const getFile = fs.readFileSync('./xmakuro').toString();

    const dataCrypt = CryptoJS.AES.encrypt(getFile, "123456").toString();
    const dataObf = obf.obfuscate(getFile);

    fs.writeFileSync(`${pathFile.name}.crp`, dataCrypt);
    fs.writeFileSync(`${pathFile.name}.obf`, dataObf.getObfuscatedCode())
    console.log('encrypt complete'.green);
}

function decrypt() {
    console.log("decript".green);
}

function builder() {
    const pathFile = path.join('./xmakuro')

    const targetFile = fs.readFileSync(pathFile).toString();
    const getFunc = targetFile.match(/function\s+\w+\s*\(\s*\)\s*/g).map(e => e.split(' ')[1].replace('()', ''));

    const getListMenu = targetFile.match(/\w+\s*listMenu[\s\S]+.*\]/g)
    const hasil = targetFile.replace(getListMenu[0], `const listMenu = ${JSON.stringify(getFunc)}`)

    fs.writeFileSync(`./${pathFile.name}`, hasil)
    console.log("builder complete".green);
}
```

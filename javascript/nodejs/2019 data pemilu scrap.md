```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const _ = require("lodash");
require('colors')
const db = new (require('simple-json-db'))("./storage.json")
const listDataProv = require("./data_pemilu_2019.json")
const args = process.argv.slice(2);


let pointer_prov = 0
let pointer_kab = 0
let pointer_kec = 0;


let list_prov = []

let page;
let browser;

let total = {
    prov: 0,
    kab: 0,
    kec: 0
}

    ; (async () => {

        if (args.length > 0) {
            if (args[0] == "clear") {
                console.log("clear pointer".red)
                db.deleteAll()
            }
        }

        const prov = await db.get('prov');
        const kab = await db.get('kab');
        const kec = await db.get('kec');

        if (prov) {
            pointer_prov = prov
        }
        if (kab) {
            pointer_kab = kab
        }
        if (kec) {
            pointer_kec = kec
        }

        list_prov = listDataProv

    })()

async function getData(page) {
    await page.waitForSelector('table');

    const results = [];

    const tables = await page.$$('table');
    for (let i = 0; i < tables.length; i++) {
        const data = await tables[i].evaluate(table => {
            const result = [];

            const rows = table.querySelectorAll('tr');
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');

                const name = cells.length < 0 ? "" : cells[0].innerText.trim();
                const value1 = cells.length < 0 ? "" : cells[1].innerText.trim();
                const value2 = cells.length < 0 ? "" : cells[2].innerText.trim();

                if (name) {
                    result.push({ name, value1, value2 });
                } else {
                    console.log("error , name tidak ditemukan".red, i)
                }
            }

            return result;
        });

        results.push(data);
    }

    return _.flatten(results);
}

async function temukanTombol(page, name) {
    console.log(" ")
    console.log("tunggu 2 detik ...")
    console.log(" ")
    await new Promise(r => setTimeout(r, 2000))
    // tunggu button muncul
    await page.waitForSelector('button');
    const [button] = await page.$x(`//button[contains(., '${name}')]`);
    return button
}

async function simpanData(list_prov) {
    // console.log(JSON.stringify(list_prov, null, 2))
    console.log(" ")
    console.log(" ")
    console.log("====================".green)
    console.log("MENYIMPAN DATA")
    console.log("====================".green)
    fs.writeFileSync('data_pemilu_2019.json', JSON.stringify(list_prov, null, 2))
    console.log("DATA BERHASIL DISIMPAN".cyan)
    console.log(" ")
    console.log(" ")
}




async function initPage() {
    // load puppeteer
    const b = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 500, height: 1280, isMobile: true },
        args: [`--window-size=500,1280`],
    })

    // define page
    const [p] = await b.pages();
    browser = b
    return p
}


async function pointer(name, ttl) {
    console.log("========================".cyan)
    console.log("temukan tombol ", name)
    console.log("pointer provinsi", pointer_prov, ttl.prov)
    console.log("pointer kabupaten", pointer_kab, ttl.kab)
    console.log("pointer kecamatan", pointer_kec, ttl.kec)
    // console.log("========================")
}



async function main() {


    if (!page) {
        console.log("init page")
        page = await initPage()
    }

    // console.log("========================".cyan)
    // console.log("menuju ke halaman".cyan, 'https://pemilu2019.kpu.go.id/#/ppwp/rekapitulasi/')
    // menuju ke halaman
    await page.goto('https://pemilu2019.kpu.go.id/#/ppwp/rekapitulasi/');

    // console.log("tunggu 2 detik ....")
    // tunggu 5 detik sehingga halaman selesai dimuat
    await new Promise(r => setTimeout(r, 2000))

    // validasi jika list provinsi kosong
    if (_.isEmpty(list_prov)) {
        // console.log("list provinsi kosong, masukkan data provinsi".yellow)
        const data_prov = await getData(page)
        if (data_prov) {
            list_prov = data_prov
        } else {

            console.log("data prov kosong".red)
            return await main()
        }
        // console.log("ditemukan provinsi sebanyak".cyan, list_prov.length)
    } else {
        // console.log("list provinsi sudah ada".yellow, list_prov.length)
    }

    pointer(list_prov[pointer_prov].name.green, total)


    // temukan tombol provinsi
    let tombol_prov = await temukanTombol(page, list_prov[pointer_prov].name)

    // validasi tombol
    if (!tombol_prov) {

        console.log("tombol provinsi tidak ditemukan".red, list_prov[pointer_prov].name)
        pointer_prov++;
        return await main()
    }

    // console.log("click tombol provinsi ".green, list_prov[pointer_prov].name)
    // tombol provinsi ditemukan lalu click
    await tombol_prov.click()

    // console.log("tunggu 1 detik ....")
    // tunggu 1 detik
    await new Promise(r => setTimeout(r, 1000))

    // validasi jika list kabupaten belum ada di provinsi
    if (!list_prov[pointer_prov].kab) {

        // console.log("data kabupaten belum ditemukan , masukkan data kabupaten".yellow)
        // masukkan data kabupaten yang didapat ke provinsi
        const data_kab = await getData(page)
        if (data_kab) {
            list_prov[pointer_prov].kab = data_kab
        } else {
            console.log("data kab kosong".red)
            return await main()

        }
        // console.log("ditemukan kabupaten sebanyak".cyan, list_prov[pointer_prov].kab.length)
    } else {
        // console.log("data kabupaten sudah ada".yellow, list_prov[pointer_prov].kab.length)
    }

    pointer(list_prov[pointer_prov].kab[pointer_kab].name.blue, total)

    // temukan tombol kabupaten
    let tombol_kab = await temukanTombol(page, list_prov[pointer_prov].kab[pointer_kab].name)

    // validasi tombol
    if (!tombol_kab) {

        console.log("tombol kabupaten tidak ditemukan".red, list_prov[pointer_prov].kab[pointer_kab].name)
        pointer_kab++;
        return await main()
    }

    // console.log(" ")
    // console.log("click tombol kabupaten ".green, list_prov[pointer_prov].kab[pointer_kab].name)
    // tombol kabupaten ditemukan
    await tombol_kab.click()

    // console.log("tunggu 1 detik ....")
    // tunggu 1 detik
    await new Promise(r => setTimeout(r, 1000))

    // validasi jika list kecamatan belum ada di kabupaten
    if (!list_prov[pointer_prov].kab[pointer_kab].kec) {
        // console.log("data kecamatan belum ditemukan , masukkan data kecamatan".yellow)
        // masukkan data kecamatan yang didapat ke kabupaten
        const data_kec = await getData(page)
        if (data_kec) {
            list_prov[pointer_prov].kab[pointer_kab].kec = data_kec
        } else {
            console.log("data kec kosong".red)
            return await main()
        }
        // console.log("ditemukan kecamatan sebanyak".cyan, list_prov[pointer_prov].kab[pointer_kab].kec.length)
    }

    pointer(list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].name.yellow, total)
    // temukan tombol kecamatan
    let tombol_kec = await temukanTombol(page, list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].name)


    // validasi tombol
    if (!tombol_kec) {
        console.log("tombol kecamatan tidak ditemukan".red, list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].name)
        pointer_kec++;
        return
        // return await main()
    }


    // console.log(" ")
    // console.log("click tombol kecamatan ".green, list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].name)
    // tombol kecamatan ditemukan
    await tombol_kec.click()

    // console.log("tunggu 1 detik ....")
    // tunggu 1 detik
    await new Promise(r => setTimeout(r, 1000))

    // validasi jika list kelurahan tidak ada di kecamatan
    if (!list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].kel) {
        // console.log("data kelurahan belum ditemukan , masukkan data kelurahan".yellow)
        // masukkan data kelurahan yang didapat ke kecamatan
        list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].kel = await getData(page)
        // console.log("ditemukan kelurahan sebanyak".cyan, list_prov[pointer_prov].kab[pointer_kab].kec[pointer_kec].kel.length)

    }

    // console.log("")


    total.prov = list_prov.length
    total.kab = list_prov[pointer_prov].kab.length
    total.kec = list_prov[pointer_prov].kab[pointer_kab].kec.length

    await simpanData(list_prov)

    if (pointer_kec < (list_prov[pointer_prov].kab[pointer_kab].kec.length - 1)) {

        // console.log("pointer kecamatan".blue, pointer_kec + 1, "total:", list_prov[pointer_prov].kab[pointer_kab].kec.length)
        pointer_kec++


        return await main()
    } else if (pointer_kab < (list_prov[pointer_prov].kab.length - 1)) {

        // console.log("pointer kabupaten".blue, pointer_kab + 1, "total:", list_prov[pointer_prov].kab.length)
        // console.log("pointer kecamatan".blue, 0)


        pointer_kab++
        pointer_kec = 0


        return await main()

    } else if (pointer_prov < (list_prov.length - 1)) {

        // console.log("pointer provinsi".blue, pointer_prov + 1, "total", list_prov.length)
        // console.log("pointer kabupaten".blue, 0)
        // console.log("pointer kecamatan".blue, 0)


        pointer_prov++
        pointer_kab = 0
        pointer_kec = 0


        return await main()

    } else {

        console.log("====================")
        console.log("lanjut disini".red)
        console.log("====================")

        // simpan data sementara
        await simpanData(list_prov)
    }

    // simpan
    await simpanData(list_prov)

}

try {
    main()
} catch (error) {
    console.log("=================".red)
    console.log(error)
    console.log("=================".red)
}
```

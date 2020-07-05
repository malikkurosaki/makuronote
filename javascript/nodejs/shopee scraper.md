# shopee scraper

```js
const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

(async () => {
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    console.log('mulai cari data url')
    
    await page.goto('https://shopee.co.id/shop/83896091/search')
    await page.setViewport({ width: 1433, height: 682 })
    await page.waitForSelector('.shopee-mini-page-controller__total')
    let halaman = await page.evaluate(() => document.querySelector('.shopee-mini-page-controller__total').innerText);
  
    var urlnya = []
    for(var i = 0;i<Number(halaman)+1;i++){
        urlnya.push('https://shopee.co.id/shop/18182608/search?page='+i)
        console.log('dapat urlnya per halaman produk : https://shopee.co.id/shop/18182608/search?page='+i);
    }
  
    console.log('coba memecah url')
    var linkNya = []
    for(var i=0;i< urlnya.length;i++){
        await page.goto(urlnya[i],{ waitUntil: 'networkidle2' })
        await page.waitForSelector('.shop-search-result-view__item:nth-child(1) > div > a ')
        linkNya.push(
            await page.evaluate(() => {
                let alamat = document.querySelectorAll('.shop-search-result-view__item');
                let data = []
                for(var x =0;x<alamat.length;x++){
                    var urlNya = document.querySelector(`.shop-search-result-view__item:nth-child(${x+1}) > div > a`);
                    console.log(urlNya)
                    data.push({
                        // "url":'https://shopee.co.id'+alamat.getAttribute('href')
                        "url":`${urlNya}`
                    })
                }
                return data;
            })
        )
    }

    console.log(linkNya)

    
    var hasil = []
    for(var i=0;i<linkNya.length;i++){
        for(var j=0;j<linkNya[i].length;j++){
            await page.goto(linkNya[i][j].url,{ waitUntil: 'networkidle2' })
            await page.waitForSelector('.product-briefing > .flex > .flex-auto > .qaNIZv > span')
            await page.waitForSelector('.flex > .flex > .flex > .flex > .\_3n5NQx')
            await page.waitForSelector('.page-product__content--left > .product-detail > .\_2C2YFD > .\_2aZyWI > .\_2u0jt9')
            await page.waitForSelector('.flex > .\_1eNVDM > .\_1anaJP > .\_3ZDC1p > .\_2JMB9h')
            await page.waitForSelector('.flex > .F3D_QV > .\_2MDwq_ > .ZPN9uD > .\_3ZDC1p > .\_2Fw7Qu')
            //await page.waitForSelector('.flex > .flex > .flex > .flex > div:nth-child(2)')
            console.log(`coba ambil data ${linkNya[i][j].url}`);

            hasil.push(
                await page.evaluate(() => {
                    var judul = document.querySelector('.product-briefing > .flex > .flex-auto > .qaNIZv > span').innerText.toString();
                    var harga = document.querySelector('.flex > .flex > .flex > .flex > .\_3n5NQx').innerText.toString();
                    var diskripsi = document.querySelector('.page-product__content--left > .product-detail > .\_2C2YFD > .\_2aZyWI > .\_2u0jt9').innerText.toString();
                    var dataFotoSampul = document.querySelector('.flex > .\_1eNVDM > .\_1anaJP > .\_3ZDC1p > .\_2JMB9h');
                    var fotoSampul = dataFotoSampul.getAttribute('style') == null?"":dataFotoSampul.getAttribute('style').match(/\"http.*?\"/g).toString().replace(/\"/g,"");
                    

                    let fotoProduk = [];
                    let fotos = document.querySelectorAll('.flex > .F3D_QV > .\_2MDwq_ > .ZPN9uD > .\_3ZDC1p > .\_2Fw7Qu');
                    for(var i = 0;i< fotos.length;i++){
                        var gambar = fotos[i] == null?"":fotos[i].getAttribute('style')
                        var hasil = gambar == null?"":gambar.match(/\"http.*?\"/g);
                        fotoProduk.push(hasil.toString().replace(/\"/g,""));
                    }
                        
                    var data = {
                        "Kategori":"",
                        "Nama Produk":judul,
                        "Diskripsi Produk":diskripsi,
                        "SKU induk":"",
                        "Kode Integrasi Variasi":"",
                        "Nama Variasi 1":"",
                        "Varian untuk Variasi 1":"",
                        "Foto Produk per Varian":"",
                        "Nama Variasi 2":"",
                        "Varian untuk Variasi 2":"",
                        "harga":harga,
                        "Stok":"100",
                        "Kode Variasi":"",
                        "Foto Sampul":fotoSampul
                    }
                    for(var a = 0;a<fotoProduk.length;a++){
                        data['Foto Sampul '+(Number(a)+1)] = fotoProduk[a];
                    }
                    data['Berat'] = "";
                    data['panjang'] = "";
                    data['Lebar'] = "";
                    data['Tinggi'] = "";
                    data['J&T Express'] = "Aktif";
                    data['SiCepat REG'] = "";
                    data['JNE Reguler (Cashless)'] = "";
                    data['Pos Kilat Khusus'] = "";
                    data['Jangka Dikirim Dalam Pre-order'] = "";
                    data['Dikirim Dalam Pre-order'] = "";


                    console.log('mendapatkan data '+data)
                    return data;
                })
            )
        }
    }
    console.log('data didapatkan mulai prosses terakhir')
    
    const csv = new ObjectsToCsv(hasil);
    await csv.toDisk('./Shopee_mass_upload.csv');
    console.log(csv.toString())
    await browser.close()
})();

```

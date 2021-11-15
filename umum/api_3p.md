```json
// const terminal = require('terminal-kit').terminal;

// terminal.gridMenu(['hidupkan server', 'matikan server'], (err, res) => {


// });


// terminal.on('key', (name, match, data) => {
//     if(name === 'CTRL_C'){
//         terminal.grabInput(false);
//         process.exit();
//     }
// });

const CryptoJS = require('crypto-js');
const axios = require('axios').default;
const https = require('https');
const crypto = require('crypto');


const userName = 'RS00001';
const pin = '1234';
const password = '666666';
const kodeProduk = 'XL10';
const msid = '087777701439';
const trxid = '209080';

const revTujuan = msid.split('').reverse().join('');
const auth = `${pin}${password}`.split('').reverse().join('');
const data = `TigaPutri256,[${userName}|${trxid}|${kodeProduk}|${revTujuan}|${auth}]`;
// const sign = btoa(CryptoJS.SHA256(data)).slice(0, -1).replaceAll('+', 'X').replaceAll('/', 'Z');
const sign = crypto.createHash('sha256').update(data).digest('base64').slice(0, -1).replaceAll('+', 'X').replaceAll('/', 'Z');

const jsnc = {
    "counter":"1",
    "hpenduser":"",
    "idproduk":"",
    "kodereseller": 'RS00001',
    "msisdn": msid,
    "produk":"XL10",
    "reffid":"2108277",
    "req":"topup",
    "signature":'DTzs97tcKKIvltciwjZwUSbiLWRFRiA6qHgXywtnIbI',
    "time":"212256",
    "pin": "1234",
    "password": "666666"
};

const jsnb = {
    "kodeReseller": "RS00001",
    "produk": "XL10",
    "msisdn": "087777701439",
    "qty": "1",
    "reffid": "48715",
    "time": "230000",
    "counter":"1",
    "req":"topup",
    "pin": "1234",
    "password": "666666"
    //"signature": "hlZ9fULNu1IDn6hl0U7sG0GPWfrVfxUHSFRAfdsAnWg"
}

const jsna = {
    "req": "cmd",
    "kodereseller":"RS00001",
    "perintah":"SAL",
    "time":"233050",
    "pin": "1234",
    "password": "666666"
    // "signature":"LaJp9pAnWYEyXgGrjMMNUBAh9XrQ1aXZMp9bNvR2FkY"
}

const jsn = {
    "req": "topup",
    "kodereseller":"RS00002",
    "produk":"XL10",
    "msisdn":"087777014395",
    "reffid":"1063343",
    "counter":1,
    "qty":1,
    "hpenduser":"0823456789",
    "time":"235945",
    // "pin": "89775",
    // "password": "sQLXkaS"
    "pin": "1234",
    "password": "1234"
}

// const sing = `dVgSykpwsNVeUZkKpv1NY3dt87e3ZZwXW4vX8lxzpuw`;

// hlZ9fULNu1IDn6hl0U7sG0GPWfrVfxUHSFRAfdsAnWg
// const url = `http://139.180.217.11:8882/trx?kodereseller=RS00001&pesan=ts.pf00002.100000.1234&time=230000&signature=${sing}`;

var convert = require('xml-js');

axios.post(`http://192.168.43.252:8882/api`, jsn)
.then( data => {
    console.log("aman gaes", data.data);
}).catch( err => {
    console.log("ada yang error", err.toString())
});

// console.log(sign);

;(async () => {
    // const res = await axios.get(`http://139.180.217.11:8882/json|req=topup&kodereseller=${userName}&produk=${kodeProduk}&msisdn=${msid}&reffid=${trxid}&time=20000&qty=1&counter=1&signature=${sign}`, {httpsAgent: https.Agent({rejectUnauthorized: false})});
    // const res = await axios.get('https://google.com', {httpsAgent: https.Agent({rejectUnauthorized: false})});
    // console.log(res.data.toString());

    // axios.post(`http://139.180.217.11:8882/json`, jsn)
    // .then( data => {
    //     console.log(data.data);
    // }).catch( err => {
    //     console.log(err.toString())
    // });

    //console.log(Date.now());

})();



```

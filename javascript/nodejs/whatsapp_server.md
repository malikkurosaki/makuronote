# waserver


server.js


```js
import {WAConnection, MessageType, Mimetype} from '@adiwajshing/baileys';
import fs from 'fs';
const session = './auth_info.json';

const Wa = {};

Wa.conn = async () => {
    const con = new WAConnection();

    if(fs.existsSync(session)){
        con.loadAuthInfo(session);

    }

    con.on('open', () => {

        try {
            const authInfo = con.base64EncodedAuthInfo();
            fs.writeFileSync(session, JSON.stringify(authInfo, null, '\t'));

        } catch (error) {
            console.log(error);
        }
        
    });

    await con.connect();
    console.log('wa server run gaes');

    return con;
};


export {Wa, WAConnection, MessageType};


```

kirim wa

```js
import express from 'express';
import handler from 'express-async-handler';
import axios  from 'axios';
import event from 'events';
import {Wa, WAConnection, MessageType} from './wa_server.js';

const app = express();

/**
 * 
 * @param {WAConnection} conn
 * @returns 
 */
async function wa (conn) {
    
    const id = '6287777701439@s.whatsapp.net';
    const sentMsg  = await conn.sendMessage (id, 'kode verifikasi anda adalah 4536, jangan share kesiapapun !', MessageType.text);

    console.log(sentMsg);
}

let nama;

;(async () => {
  
    nama = await Wa.conn();


})();

app.get('/', handler(
    async (req, res) => {
        
        if(nama != undefined){
            await wa(nama);
        }

        res.send(
            nama == undefined? 'tunggu': 'uda bisa'
        ) 

    }
));

app.listen(3000, () => console.log('server run gaes'));

export {app}

```

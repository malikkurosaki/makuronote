### web client

```js

// import firebase app
import 'https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js';

// import firebase database
import 'https://www.gstatic.com/firebasejs/7.14.0/firebase-database.js';

// import jquery
import 'https://code.jquery.com/jquery-3.6.0.min.js'


firebase.initializeApp({
    apiKey: "AIzaSyAfACNHRoyIvX4nct4juVabZDgwEDKQ6jYx",
    authDomain: "malikkurosaki1985.firebaseapp.com",
    databaseURL: "https://malikkurosaki1985x.firebaseio.com",
    projectId: "malikkurosaki1985",
    storageBucket: "malikkurosaki1985.appspot.com",
    messagingSenderId: "27222609089",
    appId: "1:27222609089:web:bf85a0777451fb17da9840"
});


const db = firebase.database();
const Soal = db.ref('/soal');
const UserSekarang = db.ref('/userSekarang');
const TopUser = db.ref('/topUser');
const ConnectedRoom = db.ref('/connectedRoom');
const Coundown = db.ref('/countdown');
const Clue = db.ref('/clue');
const JawabanBenar = db.ref('/jawabanBenar');
const RefreshSoal = db.ref('/refreshSoal');

```


### node server

```js
const { WebcastPushConnection } = require('tiktok-live-connector');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const _ = require('lodash');
const colors = require('colors');
const js = require('js-beautify').html;

const admin = require("firebase-admin");
const path = require('path');
const serviceAccount = require(path.join(__dirname, "./malikkurosaki1985-firebase-adminsdk-gdzr0-61efee2462.json"));
const db = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://malikkurosaki1985.firebaseio.com"
}).database();



const Soal = db.ref('/soal');
const UserSekarang = db.ref('/userSekarang');
const TopUser = db.ref('/topUser');
const ConnectedRoom = db.ref('/connectedRoom');
const Coundown = db.ref('/countdown');
const Clue = db.ref('/clue');
const JawabanBenar = db.ref('/jawabanBenar');
const RefreshSoal = db.ref('/refreshSoal');

RefreshSoal.on('child_changed', async (snapshot) => {
    await updateSoal();
    console.log("Refresh Soal".cyan);
})

```

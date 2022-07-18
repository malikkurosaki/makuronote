```js
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const expressAsyncHandler = require('express-async-handler');
const path = require('path');
const V2Ttok = require('./v2_ttok');
const FDb = require('./v2_fdb');
const api = require('./v2_controllers');
const uuid = require('uuid').v4

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', expressAsyncHandler(async (req, res) => {
    if (req.query.name) {
        await V2Ttok.init(req.query.name);
        res.sendFile(__dirname + '/src/index.html');
    }else{
        res.send("<h1>Please provide your name</h1>");
    }
    
}));

app.get('/uuid', (req, res) => res.send(uuid()));

app.get('/test', (req, res) => {
    FDb.event('top10').refresh;
    res.send("halo");
})



app.use(api)

app.use(express.static('src'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```


```js
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const { WebcastPushConnection } = require('tiktok-live-connector');
const _ = require('lodash');
const colors = require('colors');
const js = require('js-beautify').html;
const path = require('path');
const FDb = require('./v2_fdb');
const Prs = require('./v2_prs');
const updateQuestion = require("./v2_update_question");

let modelChat = {
    comment: '',
    userId: '',
    uniqueId: '',
    nickname: '',
    profilePictureUrl: '',
    followRole: null,
    userBadges: [],
    isModerator: false,
    isNewGifter: false,
    isSubscriber: false,
    topGifterRank: null
}

const EVENT = {
    connected: "connected",
    disconnected: "disconnected",
    streamEnd: "streamEnd",
    rawData: "rawData",
    websocketConnected: "websocketConnected",
    error: "error"
}

const MESSAGE_EVENT = {
    member: "member",
    chat: "chat",
    gift: "gift",
    roomUser: "roomUser",
    like: "like",
    social: "social",
    emote: "emote",
    envelope: "envelope",
    questionNew: "questionNew",
    linkMicBattle: "linkMicBattle",
    linkMicArmies: "linkMicArmies",
    liveIntro: "liveIntro"
}

// EVENT
// connected
// disconnected
// streamEnd
// rawData
// websocketConnected
// error

// MESSAGE EVENT
// member
// chat
// gift
// roomUser
// like
// social
// emote
// envelope
// questionNew
// linkMicBattle
// linkMicArmies
// liveIntro

const init = async (name) => {

    console.log(`${name} cconnecting ...`.green);
    let tok = new WebcastPushConnection(name);
    try {
        await tok.connect();
        let roomId = await tok.getState().roomId
        console.log("connected room " + roomId);
        console.log(`https://www.tiktok.com/@${name}/live`.green);
        
    } catch (error) {
        console.log(`${error}`.red);
    }

    tok.on(MESSAGE_EVENT.chat, onChat)

    tok.on(EVENT.disconnected, async () => {
        console.log("disconnected");
    })

}

var dijawab = false;
/**@param {modelChat} data */
async function onChat(data) {

    let question = await Prs.pSoal.findFirst({
        select: {
            Kuis: {
                select: {
                    soal: true,
                    jawaban: true
                }
            }
        }
    })

    if (_.lowerCase(question.Kuis.jawaban) == _.lowerCase(data.comment) && !dijawab) {
        dijawab = true;
        console.log("jawaban benar".cyan)
        await correctAnswer(data);
        dijawab = false;
    }
}


async function correctAnswer(content) {

    let user = await prisma.user.upsert({
        where: {
            uniqueId: content.uniqueId.toString()
        },
        update: {
            nickname: content.nickname.toString(),
            profilePictureUrl: content.profilePictureUrl.toString(),

        },
        create: {
            uniqueId: content.uniqueId.toString(),
            followRole: content.followRole.toString(),
            nickname: content.nickname.toString(),
            profilePictureUrl: content.profilePictureUrl.toString(),
        },
    })

    let score = await prisma.score.findFirst({
        where: {
            userId: user.id
        }
    })

    if (score) {
        await prisma.score.update({
            where: {
                id: score.id
            },
            data: {
                score: score.score + 1
            }
        })
    } else {
        await prisma.score.create({
            data: {
                userId: user.id,
                score: 1
            }
        })
    }

    let answerer = await prisma.userSekarang.upsert({
        where: {
            id: 1
        },
        update: {
            userId: user.id
        },
        create: {
            id: 1,
            userId: user.id,

        }
    })


    FDb.event("top10").refresh;
    FDb.event("answerer").refresh;
    FDb.event("question").refresh;

    console.log("data has been updated for correct answer".green)
}



const V2Ttok = {
    init
}

module.exports = V2Ttok
```

```html
<!DOCTYPE html>
<html lang="en">

<head >
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="module" src="v2_app.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        @font-face {
            font-family: game;
            src: url(SuperLegendBoy-4w8Y.ttf);
            display: block;
        }

        @font-face {
            font-family: naga;
            src: url(EightBitDragon-anqx.ttf);
            display: block;
        }

        @font-face {
            font-family: tale;
            src: url(AncientModernTales-a7Po.ttf);
            display: block;
        }


        .game {
            font-family: game;
        }

        .naga {
            font-family: naga;
        }

        .tale {
            font-family: tale;
        }

        .bg {
            background-image: url("./bg.jpg");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            height: 100vh;
            width: 100vw;
        }

        .box {
            background-image: url("./box.png");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            height: 100vh;
            width: 100vw;
        }
    </style>
</head>

<body class="bg">

    <div id="app">
        <div class="p-2">
            <h3 class="text-center naga text-white">Jawab Soalan Berikut</h3>
            <div class="card p-2 text-center border border-white border-4" style="background-color: #8B5268; height: 150px;">
                <h3 id="soal" class=" game text-white"></h3>
            </div>
            <div class="d-flex justify-content-center text-white naga p-2">
                <div id="clue"></div>
            </div>
            <div class="d-flex justify-content-center">
                <div style="width: 40px;"><img src="./waiting.gif" alt="waiting" class="img-fluid" width="100%"></div>
                <div id="countdown" class="display-2 p-2 naga">60</div>
            </div>
            <!-- <div class="px-2 border-bottom" style="width: 100%; height: 200px;" >
                    <img id="gam" src="" style='height: 100%; width: 100%; object-fit: contain'>
                </div> -->
        
        </div>
        <div id="userSekarang"></div>
        <div class="d-flex flex-wrap" id="top10"></div>
    </div>
</body>

</html>

```

```js

// import jquery
import 'https://code.jquery.com/jquery-3.6.0.min.js'
import FDb from './v2_fdb.js'

let waktu = 60;
let timer = null
timer = setInterval(countdown, 1000);

function answererWidget(dataUser) {
    $("#userSekarang").html(`
       <div class="px-3 naga mb-4">
            <div class="card px2">
                <div class="row px-2 d-flex align-items-center">
                        <img class="p-2 col-4" src="${dataUser.User['profilePictureUrl']}" alt="Avatar" style="width:50px ; height: 50px; border-radius: 50%;" />
                        <div class="p-2 col-8">
                            <div class="text-dark naga" style="font-weight: bold">${dataUser.User['nickname']}</div>
                            <div>score: ${dataUser.User.Score[0].score}</div>
                        </div>
                </div>
            </div>
        </div>
    `);
}

async function getQuestion() {
   
    let data = await $.get('/question');
    $("#soal").html(data.soal);
    $("#clue").html(data.clue);
    console.log("get new question");
    
}
getQuestion();

async function getAnswerer(){
    let data = await $.get('/answerer')
    console.log(JSON.stringify(data));
    answererWidget(data)
}
getAnswerer();

async function GetTop10(){
    let data = await $.get('/top10');
    console.log(data)
    let isi = data.map((e) => {
        return `
       <div class="col-6 p-2">
             <div style="height: 65px" class="card  border border-white border-4 p-2 bg-warning">
                <div class="row">
                    <div class="col-4 ">
                        <img style="width: 100%; border-radius: 50%;" src="${e.User?.profilePictureUrl ?? ''}">
                        
                    </div>
                    <div style="font-size: 16px" class="naga p-2 col-8">${e.score}</div>
                </div>
            </div>
       </div>
        
        `
    })

    $('#top10').html(isi.join(''))
}
GetTop10();

function stop() {
    clearInterval(timer);
    timer = null;
    console.log("stop");
}

function start() {
    timer = setInterval(countdown, 1000);
    waktu = 60;
    console.log("start");
}

async function countdown() {
    if (waktu <= 0) {
        stop();
        await correctAnswer()
        await getQuestion();
        start();
    } else {
        waktu--;
        $("#countdown").html(waktu);
    }
}

async function correctAnswer() {
    
    let answer = await $.get('/correct');
    await Swal.fire({
        timer: 3000,
        color: '#FFFFFF',
        background: '#044769',
        showConfirmButton: false,
        showCloseButton: false,
        html: `<h1 class="text-white naga ">${answer}</h1>`
    })
}

// FDb.soal.onValue(x => console.log(x))
let random = Math.floor(Math.random() * 10) + 1;
FDb.event("top10").onChange(() => console.log("ini di onchange top 10" + random))

FDb.event("answerer").onChange(async() => {
    stop();
    let answer = await $.get('/correct');
    let answerer = await $.get('/answerer');
    await Swal.fire({
        timer: 3000,
        color: '#FFFFFF',
        background: '#7D1A73',
        showConfirmButton: false,
        showCloseButton: false,
        html: `<di class="p-2">
            <h4 class="naga text-white">Jawaban Benar</h4>
            <div class="p-2">
                <img class="p-2" src="${answerer.User.profilePictureUrl}" alt="Avatar" style="width:70px ; height: 70px; border-radius: 50%;" />
            </div>
            <div class="text-white naga" style="font-weight: bold">${answerer.User.nickname}</div>
            <h3 class="naga text-white">${answer}</h3>
        </di>`
    })
    await getAnswerer();
    await GetTop10();
    await getQuestion();
    start();
})

// FDb.event("question").onChange(async () => {
   
// })

```


// import firebase app
import 'https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js';

// import firebase database
import 'https://www.gstatic.com/firebasejs/7.14.0/firebase-database.js';
import uuidv4 from './v2_uuid.js';

firebase.initializeApp({
    apiKey: "AIzaSyAfACNHRoyIvX4nct4juVabZDgwEDKQ6jY",
    authDomain: "malikkurosaki1985.firebaseapp.com",
    databaseURL: "https://malikkurosaki1985.firebaseio.com",
    projectId: "malikkurosaki1985",
    storageBucket: "malikkurosaki1985.appspot.com",
    messagingSenderId: "27222609089",
    appId: "1:27222609089:web:bf85a0777451fb17da9840"
});


const db = firebase.database();
const ttok = db.ref("/ttok");

/** @param {"top10" | "question" | "answerer"} child */
function event(child){
    const value = { value: `client_${uuidv4()}` }
    return {
        onChange: (val) => ttok.child(child).on("child_changed", x => {
            if (x.val().split('_')[0] === 'server') {
                val()
            }
        }),
        refresh: ttok.child(child).set(value)
    };
}

const FDb = {
    event
}

export default FDb;

```

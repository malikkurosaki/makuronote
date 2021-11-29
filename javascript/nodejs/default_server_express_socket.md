### server.js

```js

const { Server, http, express, handler , prisma } = require('./import.js');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({extended: false, type: "String"}));
app.use(express.json());
app.use(express.static('public'));

app.use("/api", handler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(403).send("FORBIDEN : hahah gk tau caranya ya ??");

    const data = await prisma.token.findFirst({
        where: {
            token: token
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })

    if(data == null) return res.status(401).send('401 | hemmm , login dulu atau daftar');

    req.user = data.user;
    next();

}));


app.use(require('./router')(io))
app.use((req, res, next) => {
    res.status(404).send("404 | cari apa gaes");
});
app.use((req, res, next) => {
    res.status(500).send("500 | server error gaes");
});


io.on('connection', require('./socket'));

const App = {};

App.run = () => {

    server.listen(3000, () => {
        console.log('listening on *:3000');
    });

    server.on('error', () => console.log('server error'));
    server.on('listening', () => console.log('server listening'));

}


module.exports = { App }




```

### socket.js

```js
const { Socket } = require("socket.io");


/**
 * 
 * @param {Socket} socket 
 */
module.exports = function (socket) {
    console.log("user connected baru");

    socket.on("connect_error", (err) => {
        console.log(err.message);
    });
}
```

### router.js

```js
const { Server } = require('socket.io');
const {router, handler} = require('./import.js');

/**
 * 
 * @param {Server} io 
 */
module.exports = function(io){

    router.get('/api/pos', (req, res) => {

        io.emit("pos", "apa kabar");
        res.send("apa kabar");
    })

    router.post('/login', handler(async (req, res) => {
        const email = req.body && req.body.email;
        
        if(email == null) return res.status(401).json(req.body);

        return res.json(email);
    }));

    return router;
}

```

### package.json

```json
{
  "name": "pos",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^3.5.0",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-async-handler": "^1.2.0",
    "prisma": "^3.5.0",
    "socket.io": "^4.4.0"
  }
}

```

### index.js

```js
const {App} = require('./server');

App.run();
```

### import.js

```js
const express = require('express');
const router = express.Router();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const handler = require("express-async-handler");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    express,
    http,
    router,
    cors,
    handler,
    Server,
    prisma
}
```



### server

```js
const express = require('express');
const app = express();
const cors = require('cors');
const SSE = require('express-sse');
const sse = new SSE();
const uuid = require('uuid').v4;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/stream', sse.init);


// setTimeout(() => {
//     try {
//         sse.updateInit("ini apa");
//         console.log("update");
//     } catch (error) {
        
//     }
   
// }, 10000);

setInterval(() => {
    try {
        sse.send(uuid());
        console.log(uuid());
    } catch (error) {

    }

}, 3000);

// setTimeout(() => {
//     try {
//         sse.send("dsdsdsdsfrfrrvvf");
//         console.log("update");
//     } catch (error) {

//     }

// }, 12000);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})


```

```js
const ev = new EventSource('/stream');
ev.onmessage = (e) => {
    console.log(e.data);
}

// ev.addEventListener('message', (e) => {
//     console.log(e.data);
// });

```

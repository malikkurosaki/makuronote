# firebase hosting function

### buat project dulu difirebase

lanjut install firebase cli

`npm install -g firebase-tools`

`firebase login`

pilih hosting configure deploy

`firebase init`

`firebase deploy`

### menambahkan function

`firebase init functions`

di index.js edit kaya gini

```javascript
const functions = require('firebase-functions');

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1  // London is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});
```

edit firebase.json 

```javascript
"hosting": {
 // ...

 // Add the "rewrites" attribute within "hosting"
 "rewrites": [ {
   "source": "/bigben",
   "function": "bigben"
 } ]
}
```


### install expressjs

`npm install express --save`

```javascript
const functions = require('firebase-functions');
const express = require('express');
const app = express();
```

```javascript
app.get('/', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.send(`
    <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes:
        <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`);
});
```

```javascrirpt
app.get('/api', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.json({bongs: 'BONG '.repeat(hours)});
});
```

`exports.app = functions.https.onRequest(app);`

```javascript
{
 "hosting": {
   // ...

   // Add the "rewrites" attribute within "hosting"
   "rewrites": [ {
     "source": "**",
     "function": "app"
   } ]
 }
}
```

`npm install --save cors`

```javascript
const cors = require('cors')({origin: true});
app.use(cors);
```

`firebase serve`

`firebase serve --only hosting`

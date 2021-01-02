const express = require('express');
const app = express();
const webRouter = express.Router();
const router = express.Router();
const http = require('http').createServer(app);
const cors = require('cors');
const body = require('body-parser')
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname,'./views')))
app.use(express.static(path.join(__dirname,'./public')))
app.use(body.urlencoded({ extended: true}))
app.use(body.json())
app.use(webRouter);
app.use('/api',router);
app.use((req, res) => {
    res.status(404).send("<center>404 | not found</center>");
})
// app.set('views', './views');
// app.set('view engine', 'pug');

http.listen(8000, () => console.log('server run on port 8000'));
module.exports = { router, webRouter };
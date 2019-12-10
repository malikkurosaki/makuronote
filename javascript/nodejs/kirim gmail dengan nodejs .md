# kirim mail dengan nodejs

```javascript
const express = require('express')
const http = require('http');
const PORT = process.env.PORT || 5000
const parser = require('body-parser')
var cors = require('cors')
var nodemailer = require('nodemailer');

const app = express();
app.use(parser.json())
app.use(parser.urlencoded({extended:true}))
app.use(cors())

app.get("/kirim",(a,b)=>{
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com', // Gmail Host
            port: 465, // Port
            secure: true, // this is true as port is 465
            auth: {
                user: 'maliksekeluarga@gmail.com', //Gmail username
                pass: 'makuro123' // Gmail password
            }
        });
     
        let mailOptions = {
            from: '"Probus system" <admin@probussystem.com>',
            to: 'probussistem@gmail.com', // Recepient email address. Multiple emails can send separated by commas
            subject: 'Dapatkan Sekarang juga Dengan Diskon Khusus',
            html:html
        };
     
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                b.send(`[{"info":"gagal","keterangan":"${error.message}"}]`)
            }else{
                b.send(`[{"info":"berhasil","keterangan":"${info.messageId}"}]`)
            }
        
        });
    });
   
})

app.get("/",(a,b)=>{
    b.send("apa kabar")
})

app.listen(PORT,()=>{
    console.log(`app run on port : ${PORT}`)
})


async function main() {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com', // Gmail Host
            port: 465, // Port
            secure: true, // this is true as port is 465
            auth: {
                user: 'maliksekeluarga@gmail.com', //Gmail username
                pass: 'makuro123' // Gmail password
            }
        });
     
        let mailOptions = {
            from: '"Probus system" <admin@artisansweb.net>',
            to: 'probussistem@gmail.com', // Recepient email address. Multiple emails can send separated by commas
            subject: 'Welcome Email',
            html:html
        };
     
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    });
  }
  



var html = `
<html><img src="https://ci5.googleusercontent.com/proxy/12z01JFM_ABYFRgRbLgUfGx-51eM8vpeTQbXk9wSJTDYJitbeEg5er3ULR6bxRPlP9Q9XghVS531kZIZXtT0eOEMkrKroYqNmrMW2lzWU6HW9_iJV7NOVCnKchXKjuTWxJ3JOdr1YdJDmiROix8naKGw=s0-d-e1-ft#https://image.e.mozilla.org/lib/fe9915707361037e75/m/5/97876846-3684-479c-b9b3-1c19517355e6.gif" alt="Trackers blocked by Firefox" style="display:block;border:0;max-width:100%;height:auto" width="440" class="CToWUd"></html>
`
```

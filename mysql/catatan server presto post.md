# catatan presto post serever

1. instal node js + npm
![](https://nodejs.org/static/images/logo.svg)
2. unzip file server presto pos
3. letakkan di tempat yang aman
4. cd /tempat_aman/prestopos (untuk setting database sebelum mengaktifkan server bisa di edit di file conf.json)
5. npm install > tunggu hingga prosses instalasi selesai
6. setting fine my.cnf (mac dan linux ) windows biasanya nampak sebagai my.ini
7. tambahkan baris kode seperti dibawah berikut
```cnf
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1
#tambahan
log-bin=bin.log
log-bin-index=bin-log.index
max_binlog_size=100M
binlog_format=row
#dibawah berikut harus sesuai dengan file mysql.sock
socket=/tmp/mysql.sock
```
8. jika semua telah beres boleh dicoba jalankan server dengan ketik 'nodemon' tanpa tanda petik
9. jika terjadi error boleh diintal daahulu nodemon secara global
```bash
npm install -g nodemon
```
10. coba lagi jalankan nodemon
```bash
probuss-MacBook-Air:prestopos probus$ nodemon
[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node prestopos.js`
[2020-03-05T01:05:23.377Z] app run on port : 8080
[2020-03-05T01:05:23.386Z] Server responded to ping
[2020-03-05T01:06:47.444Z] *** server io connected ***
```
11. jika semua berjalan lancar bisa langsung dilakukan pengetesan pada ip / buka ip + port pada browser
12. next jika tidak ada kendala bisa dilakukan pengujian aplikasi android
13. terakhir adalah instalasi stadar server pm2 'npm install pm2 -g' dan matika nodemon ctrl+c
![](https://raw.githubusercontent.com/Unitech/pm2/development/pres/pm2-v4.png)
14. jalankan server pm2 , 'pm2 start prestopos.js'
![gambar pm2](https://github.com/unitech/pm2/raw/master/pres/pm2-list.png)
15. beberapa konponen yang perlu diinstal jika server tidak berjalan semestinya
```bash
// instalation
// - npm install express
// - npm install mysql
// - npm install body-parser
// - npm install cors
// - npm install log-timestamp
// - npm install socket.io
// - npm install @rodrigogs/mysql-events
// - npm install pug
```

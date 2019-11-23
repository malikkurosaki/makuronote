# apache bersama dengan nodejs

```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v

sudo apt install build-essential

cd ~/
sudo nano server.js

// code

const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Node.js!\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


///

sudo npm install pm2@latest -g

pm2 start server.js

sudo apt install apache2

sudo a2dissite 000-default

sudo a2enmod proxy proxy_http rewrite headers expires

sudo nano /etc/apache2/sites-available/domain.conf

<VirtualHost *:80>
    ServerName domain.com
    ServerAlias www.domain.com

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
</VirtualHost>

sudo a2ensite domain.conf

sudo service apache2 restart

sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt install python-certbot-apache

sudo certbot --apache -m your-email -d domain.com -d www.domain.com

```

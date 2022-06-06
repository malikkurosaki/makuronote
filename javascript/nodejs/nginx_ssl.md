from: https://gist.github.com/basharovV/e25989cc918f0b21ded26c8bf3be8400

How to configure HTTPS with Lets Encrypt, Nginx reverse proxy, Express and Node
Have a Node app ready for production.
Create an app.js file in your project directory:
const express = require('express');
const path = require('path');
const app = express();

// Allow dotfiles - this is required for verification by Lets Encrypt's certbot
app.use(express.static(path.join(__dirname, 'build'), {dotfiles: 'allow'}));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);
Follow this guide to get your SSL certificates
Configure Nginx at /etc/nginx/sites-available/default
# Default server configuration
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name example.com www.example.com;
	return 301 https://$server_name$request_uri;
}

# Virtual Host/SSL/Reverse proxy configuration for example.com

server {
    # Listen on both HTTP and HTTPS - between Nginx and Express the traffic is HTTP but this is not a major
    # security concern as both services are on the same box
    listen 80;
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    include snippets/ssl-example.com.conf;
    include snippets/ssl-params.conf;

    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Allow location for Acme challenge - you also might need to allow 'dotfiles' in Express (see next section)
    location ~ /.well-known {
        allow all;
	proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
    }	
}
Restart Nginx and start your Express server (I recommend PM2 to manage the process):
sudo systemctl restart nginx
In your project directory:

pm2 start app.js


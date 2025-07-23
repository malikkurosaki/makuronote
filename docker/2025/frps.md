## FRPS

### SERVER

docker-compose.yml

```yml
services:
  frps:
    image: snowdreamtech/frps:latest
    container_name: frps
    command: -c /etc/frp/frps.ini
    ports:
      - "7000:7000"     # hanya ini yang wajib
      - "7500:7500"     # dashboard jika diperlukan
      - "6000:6000"     # untuk ssh
    volumes:
      - ./data/frps.ini:/etc/frp/frps.ini
      - ./data/logs:/var/log/frp
    restart: unless-stopped
    networks:
      - makuro-network  # hanya satu network
  nginx:
    image: nginx:latest
    container_name: nginx-router
    restart: always
    ports:
      - "4000:80"  
    volumes:
       - ./default.conf:/etc/nginx/conf.d/default.conf:ro
       - ./html:/usr/share/nginx/html:ro
    networks:
      - makuro-network


networks:
  makuro-network:
    external: true      # asumsi ini didefinisikan oleh nginx atau jaringan utama


```

data/frps.ini

```ini
[common]
# Port yang digunakan frpc untuk terhubung ke frps
bind_port = 7000
bind_addr = 0.0.0.0

# Autentikasi token, harus sama dengan frpc
auth_token = xxxxxxxxxx

# Dashboard web untuk memantau status frp (opsional)
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin123

# Port virtual host untuk mode http/https reverse proxy (internal only)
vhost_http_port = 4080
vhost_https_port = 4443

# Logging
log_level = info
log_file = /var/log/frp/frps.log
log_max_days = 3

# Performa
max_pool_count = 5
heartbeat_timeout = 90

```

### Custom Default Page Nginx

docker-compose.yml

```conf
services:
  nginx:
    image: nginx:latest
    container_name: nginx-router
    restart: always
    ports:
      - "4000:80"  
    volumes:
       - ./default.conf:/etc/nginx/conf.d/default.conf:ro
       - ./html:/usr/share/nginx/html:ro
    networks:
      - makuro-network

networks:
  makuro-network:
    external: true
```

default.conf

```conf
# Mapping subdomain ke container:port
map $subdomain $upstream_url {
    # container langsung
    wibugit     wibugit:3000;

    # semua subdomain lain ke FRP reverse proxy
    default     frps:4080;
}

server {
    listen 80;
    server_name ~^(?<subdomain>[^.]+)\.wibudev\.com$;

    resolver 127.0.0.11 valid=10s;
    client_max_body_size 200M;

    location / {
        proxy_pass http://$upstream_url;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;

        proxy_intercept_errors on;  # <- penting

        error_page 502 503 504 = /err_5x.html;
        error_page 404 = /err_404.html;
    }
    
    location = /err_5x.html {
        root /usr/share/nginx/html;
        internal;
    }

    location = /err_404.html {
        root /usr/share/nginx/html;
        internal;
    }

}
```

html/err_404.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Service Unavailable</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <h1>Oops! Service unavailable.</h1>
    <p>The service is currently down or not responding.</p>
    <p><em>404 | Not Found</em></p>
</body>
</html>

```

html/err_5x.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Service Unavailable</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <h1>Oops! Service unavailable.</h1>
    <p>The service is currently down or not responding.</p>
    <p><em>Faithfully yours, nginx.</em></p>
</body>
</html>
```

## CLIENT

docker-compose.yml

```yml
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    command: -c /etc/frp/frpc.ini
    volumes:
      - ./data/frpc.ini:/etc/frp/frpc.ini
    restart: unless-stopped
    networks:
      - makuro-network
  ssh-server:
    image: linuxserver/openssh-server:latest
    container_name: ssh-server
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Makassar
      - USER_NAME=makuro
      - SUDO_ACCESS=false
      - PASSWORD_ACCESS=false 
      - LISTEN_PORT=2222
      - PUBLIC_KEY=${SSH_PUBLIC_KEY}
    volumes:
      - ./ssh-config:/config
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD", "nc", "-z", "localhost", "22"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
networks:
  makuro-network:
    external: true
```

data/frpc.ini

```ini
[common]
server_addr = 85.31.xxx.xxx
server_port = 7000
auth_token = xxxxxxxxxxxxxx

[ssh]
type = tcp
local_ip = ssh-server
local_port = 2222
remote_port = 6000

[web]
type = http
local_ip = webrtc
local_port = 3000
custom_domains = app.wibudev.com
```

### ssh

generate key

```sh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
```

yang diambil adalah `id_ed25519.pub` paste ke SSH_PUBLIC_KEY

.env

```ini
SSH_PUBLIC_KEY=
```

~/.ssh/config

```sh
Host bip-local
  HostName 85.31.xxx.xxx
  User makuro
  Port 6000
  IdentityFile ~/.ssh/id_ed25519_frpc
```

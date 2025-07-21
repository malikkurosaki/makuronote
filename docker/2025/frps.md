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
    volumes:
      - ./html:/usr/share/nginx/html
      - ./data/frps.ini:/etc/frp/frps.ini
      - ./data/logs:/var/log/frp
    restart: unless-stopped
    networks:
      - makuro-network  # hanya satu network

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
auth_token = secure_token_2025

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

default.conf

```txt
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

        error_page 502 503 504 = /custom_error.html;  # tangani error proxy
    }

    location = /custom_error.html {
        root /usr/share/nginx/html;  # letakkan HTML di sini
        internal;
    }
}


```

html/custom_error.html

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


### CLIENT

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

networks:
  makuro-network:
    external: true
```

data/frpc.ini

```ini
[common]
server_addr = 85.31.224.193
server_port = 7000
auth_token = secure_token_2025

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000

[web]
type = http
local_ip = webrtc
local_port = 3000
custom_domains = app.wibudev.com
```

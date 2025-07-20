## FRPS

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

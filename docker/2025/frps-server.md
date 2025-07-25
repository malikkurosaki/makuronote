# FRPS

# server

/opt/frps/frps.toml

```toml
[common]
# Port yang digunakan frpc untuk terhubung ke frps
bind_port = 7000
bind_addr = "0.0.0.0"

# Autentikasi token, harus sama dengan frpc
auth_token = "xxxxxxxxxx"

# Dashboard web untuk memantau status frp (opsional)
dashboard_port = 7500
dashboard_user = "admin"
dashboard_pwd = "admin123"

# Port virtual host untuk mode http/https reverse proxy (internal only)
vhost_http_port = 4080
# vhost_https_port = 4443
```

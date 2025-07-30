# FRPS

### server linux

/opt/frps/frps.toml

frps.toml 

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

### Service

/home/makuro/.config/systemd/user/frps.service

```service
[Unit]
Description=FRP Server (frps) by user makuro
After=network.target

[Service]
Type=simple
ExecStart=/opt/frps/frps -c /opt/frps/frps.toml
Restart=on-failure

[Install]
WantedBy=default.target
```

`systemctl --user enable frps.service`

jalan terus

`sudo loginctl enable-linger makuro`

`systemctl --user start frps.service`

`systemctl --user status frps.service`

`systemctl --user stop frps.service`

`systemctl --user restart frps.service`

log

`journalctl --user -u frps.service -f`

disable

`systemctl --user disable frps.service`

unregister

`systemctl --user disable --now frps.service`



## client mac

/Users/bip/frp/frpc

frpc.toml 

```toml
[common]
server_addr = "xxx.ip.server.xxx"
server_port = 7000
transport.tcp_mux = true
transport.pool_count = 5
transport.tls.enable = true

auth_token = "xxxx"

[sshOffice1]
type = "tcp"
local_ip = "127.0.0.1"
local_port = 22
remote_port = 6001
```

### service

~/Library/LaunchAgents/com.bip.frpc.plist

```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
    "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.bip.frpc</string>

    <key>ProgramArguments</key>
    <array>
        <string>/Users/bip/frp/frpc</string>
        <string>-c</string>
        <string>/Users/bip/frp/frpc.toml</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>WorkingDirectory</key>
    <string>/Users/bip/frp</string>

    <key>StandardOutPath</key>
    <string>/Users/bip/frp/frpc.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/bip/frp/frpc.err</string>
</dict>
</plist>
```

`launchctl load -w ~/Library/LaunchAgents/com.bip.frpc.plist`

`launchctl load ~/Library/LaunchAgents/com.bip.frpc.plist`

hentikan

`launchctl unload -w ~/Library/LaunchAgents/com.bip.frpc.plist`

restart

`launchctl stop com.bip.frpc
launchctl start com.bip.frpc
`

cek status

`launchctl list | grep frpc`

log

`tail -f /Users/bip/frp/frpc.log`

ubah kepemilikan

`
sudo chown root:wheel /Library/LaunchDaemons/com.bip.frpc.plist
sudo launchctl load -w /Library/LaunchDaemons/com.bip.frpc.plist
`

## Client Docker

frpc.toml

```toml
[common]
server_addr = "85.31.224.193"
server_port = 7000
transport.tcp_mux = true
transport.pool_count = 5
transport.tls.enable = true

auth_token = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

[web-nextjs]
type = http
local_ip = "sistem-desa-mandiri"
local_port = 3000
custom_domains = "sdm.wibudev.com"

[db]
type = tcp
local_ip = "db"
local_port = 5432
remote_port = 6002
```

docker-compose.yml

```yml
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    command: -c /etc/frp/frpc.toml
    volumes:
      - ./frpc.toml:/etc/frp/frpc.toml
    restart: unless-stopped
    networks:
      - makuro-network
networks:
  makuro-network:
    external: true
```



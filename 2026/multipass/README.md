# Setup Multipass + FRP — Catatan Pribadi
> Berhasil dilakukan: 30 Mei 2026

---

## Tujuan
Akses Ubuntu (Multipass) dari mana saja lewat domain `bagas-local.ssh.wibudev.com` menggunakan FRP sebagai tunnel.

---

## Arsitektur

```
MacBook (bagasbanuna)
├── Docker → frpc (FRP Client)
│   └── tunnel ke connect.wibudev.com
├── socat → forward port 2222 Mac ke Multipass
└── Multipass → Ubuntu Server (192.168.252.2)
    └── SSH port 22 → diakses via port 2222
```

---

## Step 1 — Install & buat VM Ubuntu di Multipass

```bash
# Install Multipass di Mac
brew install multipass

# Buat VM Ubuntu
multipass launch --name ubuntu-server

# Cek IP VM
multipass list
# Catat IPv4 → biasanya 192.168.64.x atau 192.168.252.x
```

---

## Step 2 — Aktifkan SSH di dalam Multipass

```bash
# Masuk ke VM
multipass shell ubuntu-server

# Install & aktifkan SSH
sudo apt update
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh

# Keluar dari VM
exit
```

---

## Step 3 — Forward port Mac ke Multipass (socat)

```bash
# Install socat di Mac
brew install socat

# Forward port 2222 Mac → port 22 Multipass
# Ganti 192.168.252.2 dengan IP Multipass kamu
sudo socat TCP-LISTEN:2222,fork TCP:192.168.252.2:22 &
```

> Untuk membuat permanen, tambahkan ke startup Mac atau jalankan setiap kali Mac restart.

---

## Step 4 — Setup FRP Client (frpc) via Docker

```yaml
# docker-compose.yml
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: unless-stopped
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - public-net
    configs:
      - source: frpc_config
        target: /etc/frp/frpc.toml
    mem_limit: 64m
    cpus: "0.25"
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: "3"

configs:
  frpc_config:
    content: |
      serverAddr = "connect.wibudev.com"
      serverPort = 443
      auth.token = "YOUR_TOKEN"
      transport.protocol = "wss"
      transport.heartbeatInterval = 30
      transport.heartbeatTimeout = 90

      [[proxies]]
      name = "ssh-bagas-local"
      type = "tcpmux"
      multiplexer = "httpconnect"
      localIP = "host.docker.internal"
      localPort = 2222        # → diteruskan ke Multipass via socat
      customDomains = ["bagas-local.ssh.wibudev.com"]

      [[proxies]]
      name = "bagas-local"
      type = "http"
      localIP = "host.docker.internal"
      localPort = 3030
      customDomains = ["bagas-local.wibudev.com"]

networks:
  public-net:
    external: true
```

```bash
# Jalankan
docker compose up -d
```

---

## Step 5 — Tambahkan SSH key Mac ke Multipass

```bash
# Cek public key di Mac
cat ~/.ssh/id_ed25519.pub

# Masuk ke Multipass via IP langsung
ssh ubuntu@192.168.1.121 -p 2222

# Di dalam Multipass — paste public key Mac
echo "PASTE_PUBLIC_KEY_DISINI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

exit
```

---

## Step 6 — Setup SSH config di Mac

```bash
# Edit ~/.ssh/config
nano ~/.ssh/config
```

```
Host bagas-local
    HostName bagas-local.ssh.wibudev.com
    User ubuntu
    Port 2222
    ProxyCommand ncat --proxy-type http --proxy connect.wibudev.com:2222 %h %p
```

---

## Step 7 — Test koneksi

```bash
# Via IP langsung (lokal)
ssh ubuntu@192.168.1.121 -p 2222

# Via FRP (dari mana saja)
ssh bagas-local
```

---

## Troubleshooting

| Error | Penyebab | Solusi |
|---|---|---|
| `Connection refused` | socat belum jalan | Jalankan ulang socat di Mac |
| `Permission denied (publickey)` | Public key belum didaftarkan | Ulangi Step 5 |
| `Password diminta terus` | authorized_keys belum benar | Cek `chmod 600 ~/.ssh/authorized_keys` |
| FRP tidak konek | Docker belum jalan | `docker compose up -d` |

---

## Perintah berguna sehari-hari

```bash
# Cek VM Multipass
multipass list
multipass info ubuntu-server

# Masuk VM langsung (tanpa SSH)
multipass shell ubuntu-server

# Restart socat (kalau Mac restart)
sudo socat TCP-LISTEN:2222,fork TCP:192.168.252.2:22 &

# Cek FRP jalan
docker ps | grep frpc
docker logs frpc
```

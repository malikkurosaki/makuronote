# go2rtc Streaming Setup

Streaming video dari browser ke browser menggunakan [go2rtc](https://github.com/AlexxIT/go2rtc) sebagai relay server.

## Arsitektur

```
[pengirim.html]  →  WebRTC (push)  →  [go2rtc server]  →  WebRTC (pull)  →  [penerima.html]
  Mac / browser                       100.64.0.8:1984                        Browser mana saja
```

## Struktur File

```
.
├── compose.yml      # Docker Compose untuk Portainer
├── pengirim.html    # Halaman untuk push stream dari browser
├── penerima.html    # Halaman untuk melihat stream di browser
└── README.md        # Dokumentasi ini
```

## Cara Deploy

### 1. Deploy go2rtc via Portainer

1. Buka Portainer → **Stacks** → **Add stack**
2. Nama stack: `go2rtc`
3. Copy-paste isi `compose.yml` ke editor
4. Klik **Deploy the stack**
5. Verifikasi: buka `http://100.64.0.8:1984`

### 2. Jalankan web server lokal

```bash
cd /path/to/folder/ini
python3 -m http.server 8081
```

### 3. Buka pengirim

```
http://localhost:8081/pengirim.html
```

- Isi **Server**: `http://100.64.0.8:1984`
- Isi **Nama stream**: bebas, contoh `macbook`
- Klik **▶ Mulai Kirim**
- Izinkan akses kamera & mikrofon

### 4. Buka penerima

```
http://localhost:8081/penerima.html
```

Atau dari device/browser lain:
```
http://100.64.0.8:1984/stream.html?src=macbook
```

- Isi **Server** & **Nama stream** yang sama
- Klik **▶ Tonton**

---

## Konfigurasi go2rtc

Config disimpan di `/config/go2rtc.yaml` di dalam container:

```yaml
streams:
  macbook:        # nama stream, kosong = siap menerima push

api:
  origin: "*"    # izinkan CORS dari semua origin

webrtc:
  listen: ":8555/tcp"       # TCP only, lebih stabil untuk VPN/Tailscale
  candidates:
    - YOUR_SERVER_IP:8555   # Ganti dengan IP server kamu, contoh:
                            #   Tailscale : 100.x.x.x
                            #   LAN       : 192.168.x.x
                            #   Public IP : cek via `curl ifconfig.me`
```

### Kenapa TCP only?
Tailscale menggunakan enkripsi WireGuard. WebRTC UDP sering tidak bisa menembus network Docker ke Tailscale interface. TCP lebih reliable untuk setup VPN.

### Kenapa perlu `candidates`?
Docker membuat network internal tersendiri (`172.x.x.x`). Tanpa `candidates`, go2rtc hanya mengumumkan IP Docker ke browser — browser tidak bisa konek ke IP internal Docker. Dengan `candidates`, go2rtc mengumumkan IP Tailscale yang bisa dijangkau.

---

## Manage Stream via API

Tidak perlu restart container untuk tambah/hapus stream:

```bash
# Daftarkan stream baru (kosong, siap menerima push)
curl -X PUT "http://100.64.0.8:1984/api/streams?name=namastream"

# Lihat semua stream aktif
curl http://100.64.0.8:1984/api/streams

# Hapus stream
curl -X DELETE "http://100.64.0.8:1984/api/streams?src=namastream"
```

---

## Port

| Port | Protokol | Fungsi |
|------|----------|--------|
| `1984` | TCP | Web UI + HTTP API |
| `8554` | TCP | RTSP server |
| `8555` | TCP | WebRTC media |

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Container crash (exit 127) | `command:` path salah di compose | Hapus baris `command` |
| CORS blocked | Env var `GO2RTC_API_ORIGIN` tidak dikenali | Set via `go2rtc.yaml`: `api.origin: "*"` |
| Penerima berputar terus | WebRTC bind ke IP Docker, bukan Tailscale | Tambah `candidates` & gunakan TCP only |
| Stream 404 | Stream belum didaftarkan | `curl -X PUT "http://100.64.0.8:1984/api/streams?name=xxx"` |

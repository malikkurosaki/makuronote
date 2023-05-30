
sumber : https://www.kangarif.net/2020/07/cara-install-openvpn-di-vps-debian-10.html

Cara Install OpenVPN di VPS Debian 10 64 bit

Berikut adalah cara install OpenVPN di VPS Debian 10 64 bit.

1. Lakukan koneksi SSH ke VPS dengan menggunakan aplikasi seperti Putty (Windows) atau JuiceSSH (Android) dengan user root

2. Jalankan perintah berikut untuk mengupdate dan mengupgrade sistem paket aplikasi

apt-get update
apt-get upgrade -y

3. Jalankan perintah berikut untuk menginstall OpenVPN dan UFW

apt-get -y install openvpn ufw

4. Salin direktori easy-rsa ke direktori openvpn dengan perintah berikut

cp -r /usr/share/easy-rsa /etc/openvpn/

5. Ubah direktori ke /etc/openvpn/easy-rsa dengan perintah berikut

cd /etc/openvpn/easy-rsa

6. Buat file vars dengan perintah berikut

nano vars

Tambahkan baris-baris berikut

set_var EASYRSA                 "$PWD"
set_var EASYRSA_PKI             "$EASYRSA/pki"
set_var EASYRSA_DN              "cn_only"
set_var EASYRSA_REQ_COUNTRY     "INDONESIA"
set_var EASYRSA_REQ_PROVINCE    "DKIJAKARTA"
set_var EASYRSA_REQ_CITY        "JAKARTA"
set_var EASYRSA_REQ_ORG         "KANGARIFNET"
set_var EASYRSA_REQ_EMAIL       "bustami@kangarif.net"
set_var EASYRSA_REQ_OU          "Kangarifnet"
set_var EASYRSA_KEY_SIZE        2048
set_var EASYRSA_ALGO            rsa
set_var EASYRSA_CA_EXPIRE       7500
set_var EASYRSA_CERT_EXPIRE     365
set_var EASYRSA_NS_SUPPORT      "no"
set_var EASYRSA_NS_COMMENT      "Kangarifnet CERTIFICATE AUTHORITY"
set_var EASYRSA_EXT_DIR         "$EASYRSA/x509-types"
set_var EASYRSA_SSL_CONF        "$EASYRSA/openssl-easyrsa.cnf"
set_var EASYRSA_DIGEST          "sha256"
Silahkan Anda sesuaikan pada baris yang saya beri kotak merah, atau Anda biarkan saja juga tidak apa-apa.

![gambar]("edit vars.png")

Cara Install OpenVPN di VPS Debian 10 64 bit


Setelah selesai Anda sesuaikan, simpan file dengan cara tekan Ctrl x lalu y lalu Enter.

7. Jalankan perintah berikut untuk menginisiasi direktori PKI

./easyrsa init-pki

8. Buat sertifikat CA dengan perintah berikut

./easyrsa build-ca nopass

Pada saat muncul prompt Common Name seperti di gambar berikut, tekan Enter saja

Cara Install OpenVPN di VPS Debian 10 64 bit


9. Jalankan perintah berikut untuk membuat file request sertifikat dan file key untuk server

./easyrsa gen-req server nopass

Pada saat muncul prompt Common Name seperti di gambar berikut, tekan Enter saja

Cara Install OpenVPN di VPS Debian 10 64 bit


10. Buat file sertifikat untuk server dengan perintah berikut

./easyrsa sign-req server server

Saat muncul prompt Confirm request details seperti di gambar berikut, ketik yes lalu tekan Enter

Cara Install OpenVPN di VPS Debian 10 64 bit


11. Buat Diffie-Hellman key dengan perintah berikut

./easyrsa gen-dh

12. Salin file-file sertifikat dan key yang tadi kita buat untuk server ke direktori /etc/openvpn/server/ dengan perintah berikut

cp pki/ca.crt /etc/openvpn/server/
cp pki/dh.pem /etc/openvpn/server/
cp pki/private/server.key /etc/openvpn/server/
cp pki/issued/server.crt /etc/openvpn/server/
13. Jalankan perintah berikut untuk membuat file request sertifikat dan file key untuk client

./easyrsa gen-req client nopass

Pada saat muncul prompt Common Name seperti di gambar berikut, tekan Enter saja

Cara Install OpenVPN di VPS Debian 10 64 bit


14. Buat file sertifikat untuk client dengan perintah berikut

./easyrsa sign-req client client

Saat muncul prompt Confirm request details seperti di gambar berikut, ketik yes lalu tekan Enter

Cara Install OpenVPN di VPS Debian 10 64 bit


15. Salin file ca.crt, client.crt dan client.key ke direktori /etc/openvpn/client/ dengan perintah berikut

cp pki/ca.crt /etc/openvpn/client/
cp pki/issued/client.crt /etc/openvpn/client/
cp pki/private/client.key /etc/openvpn/client/
16. Buat file konfigurasi OpenVPN dengan perintah berikut

nano /etc/openvpn/server.conf
BACA JUGA
Cara Install Pale Moon di Debian 11 (Bullseye)
Cara Install Microsoft Edge di Debian 11
Cara Install LXQT di Debian 11 (Bullseye)

Tambahkan baris-baris berikut

port 1194
proto tcp
dev tun
ca /etc/openvpn/server/ca.crt
cert /etc/openvpn/server/server.crt
key /etc/openvpn/server/server.key
dh /etc/openvpn/server/dh.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist /var/log/openvpn/ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 208.67.222.222"
push "dhcp-option DNS 208.67.220.220"
duplicate-cn
keepalive 10 120
cipher AES-256-CBC
user nobody
group nogroup
persist-key
persist-tun
status /var/log/openvpn/openvpn-status.log
log /var/log/openvpn/openvpn.log
verb 3
explicit-exit-notify 0
Simpan file dengan cara tekan Ctrl x lalu y lalu Enter

17. Atur IP forwarding dengan cara edit file /etc/sysctl.conf dengan perintah berikut

nano /etc/sysctl.conf

Perhatikan baris yang saya beri kotak merah, hapus tanda # di depannya sehingga menjadi

net.ipv4.ip_forward=1

Simpan file dengan cara tekan Ctrl x lalu y lalu Enter

18. Untuk menerapkan perubahan di IP forwarding jalankan perintah berikut

sysctl -p

19. Jalankan perintah berikut untuk mengetahui public network interface di VPS kita

ip route | grep default

Cara Install OpenVPN di VPS Debian 10 64 bit


Yang saya beri kotak merah di atas adalah public network interface di VPS kita

20. Edit file /etc/ufw/before.rules dengan perintah berikut

nano /etc/ufw/before.rules

Tambahkan baris berikut

# START OPENVPN RULES
# NAT table rules
*nat
:POSTROUTING ACCEPT [0:0]
# Allow traffic from OpenVPN client to eth0 (change to the interface you discovered!)
-A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
COMMIT
# END OPENVPN RULES
Pastikan posisi baris yang Anda tambahkan seperti di gambar berikut (di bawah kotak merah)

Cara Install OpenVPN di VPS Debian 10 64 bit

Ganti eth0 dengan public network interface yang Anda dapatkan di langkah no 19 di atas

Simpan file dengan cara tekan Ctrl x lalu y lalu Enter

21. Jalankan perintah berikut utuk memberi tahu UFW agar mengizinkan penerusan paket

nano /etc/default/ufw

Perhatikan pada baris yang saya beri kotak merah. Ubah DROP menjadi ACCEPT

Simpan file dengan cara tekan Ctrl x lalu y lalu Enter

22. Jalankan perintah berikut agar UFW mengijinkan OpenVPN di port 1194 TCP dan juga OpenSSH

ufw allow 1194/tcp
ufw allow OpenSSH
23. Jalankan perintah berikut untuk mendisable dan mengenable UFW

ufw disable
ufw enable
Jika muncul prompt seperti di bawah ini, ketik y lalu tekan Enter

Cara Install OpenVPN di VPS Debian 10 64 bit


24. Jalankan perintah berikut untuk menstart OpenVPN

systemctl start openvpn@server

25. Jalankan perintah berikut agar OpenVPN otomatis start waktu boot

systemctl enable openvpn@server

26. Jalankan perintah berikut untuk membuat file client.ovpn

nano /etc/openvpn/client/client.ovpn

Tambahkan baris-baris berikut

client
dev tun
proto tcp
remote 139.162.12.9 1194
resolv-retry infinite
nobind
user nobody
group nogroup
persist-key
persist-tun
mute-replay-warnings
ca ca.crt
cert client.crt
key client.key
remote-cert-tls server
cipher AES-256-CBC
verb 3
mute 20
Ubah 139.162.12.9 dengan IP VPS Anda

Simpan file dengan cara tekan Ctrl x lalu y lalu Enter

Rangkuman

Sampai di sini kita sudah selesai melakukan beberapa hal berikut :

Menginstall OpenVPN dan UFW
Membuat file-file sertifikat dan key yang diperlukan
Mengatur konfigurasi OpenVPN
Membuat file client.ovpn untuk client
Mengatur IP Forwarding dan UFW rules

Agar client dapat melakukan koneksi OpenVPN maka file /etc/openvpn/client/client.ovpn harus Anda salin ke komputer. Untuk menyalinnya Anda bisa menggunakan aplikasi WinSCP.

Salin juga file file berikut ke komputer dengan menggunakan WinSCP :
/etc/openvpn/client/ca.crt, /etc/openvpn/client/client.crt, /etc/openvpn/client/client.key

Sebagai catatan agar client dapat melakukan koneksi OpenVPN maka memerlukan empat buah file di atas, yaitu : client.ovpn, ca.crt, client.crt dan client.key.

Penutup

Demikianlah telah saya bagikan tutorial bagaimana cara install OpenVPN di VPS Debian 10 64 bit. Semoga bermanfaat.





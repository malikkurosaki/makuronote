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

Cara Install OpenVPN di VPS Debian 10 64 bit


Setelah selesai Anda sesuaikan, simpan file dengan cara tekan Ctrl x lalu y lalu Enter.





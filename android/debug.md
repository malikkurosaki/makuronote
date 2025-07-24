# Server FRPS yang akan dituju
serverAddr = "85.31.224.193"
serverPort = 7000

[auth]
method = "token"
token = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

[transport]
tcpMux = true
poolCount = 5

[transport.tls]
enable = true

# Forward SSH (akses port 22)
[[proxies]]
name = "ssh"
type = "tcpmux"
localIP = "ssh-server"
localPort = 2222
remotePort = 6000

# Forward HTTP (akses web lokal)
[[proxies]]
name = "web"
type = "http"
localIP = "webrtc"
localPort = 3000
customDomains = ["app.wibudev.com"]

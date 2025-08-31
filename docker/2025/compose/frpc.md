compose.yml

```yml
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: always
    volumes:
      - ./frpc.toml:/etc/frp/frpc.toml:ro
    networks:
      - makuro-network

networks:
  makuro-network:
    external: true
```

frpc.toml

```toml
[common]
server_addr = "85.31.224.xxx"
server_port = 7000
transport.tcp_mux = true
transport.pool_count = 5
transport.tls.enable = true

auth_token = "xxx"

[cloud-flowise]
type = http
# menggunakan docker domain
local_ip = flowise-ui
local_port = 3000
custom_domains = "cloud-aiflow.wibudev.com"
```

# SSH

```yml
services:
  ssh-server:
    image: linuxserver/openssh-server:latest
    container_name: ssh-server
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Makassar
      - PUBLIC_KEY=${SSH_PUBLIC_KEY}
      - USER_NAME=makuro
      - SUDO_ACCESS=false
      - LISTEN_PORT=22
    volumes:
      - ./ssh-config:/config
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD", "nc", "-z", "localhost", "22"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
networks:
  makuro-network:
    external: true


```

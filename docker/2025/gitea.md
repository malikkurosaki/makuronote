# GITEA

docker-compose.yml

```yml
services:
  wibugit:
    image: gitea/gitea:latest
    container_name: wibugit
    restart: always
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__server__DOMAIN=wibugit.wibudev.com
      - GITEA__server__ROOT_URL=https://wibugit.wibudev.com  
      - GITEA_CUSTOM=/data/gitea/custom
      - GITEA__server__HTTP_PORT=3000 
      - GITEA__mailer__ENABLED=true
      - GITEA__mailer__SMTP_ADDR=smtp.gmail.com
      - GITEA__mailer__SMTP_PORT=587
      - GITEA__mailer__FROM=bip.production.js@gmail.com
      - GITEA__mailer__USER=bip.production.js@gmail.com
      - GITEA__mailer__PASS=${GITEA_MAILER_PASS}
    volumes:
      - ./data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    networks:
      - makuro-network
networks:
  makuro-network:
    external: true
```

.env

```ini
GITEA_MAILER_PASS=
```



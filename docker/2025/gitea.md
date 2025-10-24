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

update

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
      - ./data/gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    depends_on:
      wibugit-postgres:
        condition: service_healthy
    networks:
      - wibugit-network
  wibugit-frpc:
    image: snowdreamtech/frpc:latest
    container_name: wibugit-frpc
    restart: always
    volumes:
      - ./data/frpc/frpc.toml:/etc/frp/frpc.toml:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    depends_on:
      wibugit-postgres:
        condition: service_healthy
    networks:
      - wibugit-network
  wibugit-postgres:
    image: postgres:16
    container_name: wibugit-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=wibugit
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - wibugit-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U bip -d wibugit']
      interval: 5s
      timeout: 5s
      retries: 5
networks:
  wibugit-network:
    driver: bridge
```



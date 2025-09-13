Dockerfile

```Dockerfile
FROM ubuntu:22.04

# Install dependencies + vi
RUN apt-get update && apt-get install -y \
    curl unzip ca-certificates git vim \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && node -v && npm -v

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && mv /root/.bun/bin/bun /usr/local/bin/bun \
    && bun --version

WORKDIR /app

# Use exec form (better signal handling)
CMD ["sh", "-c", "if [ -d './current' ] && [ -f './current/package.json' ]; then cd current && bun start; else echo 'No ./current with package.json found, container idle...' && tail -f /dev/null; fi"]


```

compose.yml

```yml
services:
  prod:
    image: bip/prod:latest
    container_name: prod
    volumes:
      - ./data/prod:/app
    restart: unless-stopped
    networks:
      - makuro-network
    depends_on:
      prod-postgres: 
        condition: service_healthy
  prod-postgres:
    image: postgres:16
    container_name: prod-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=prod
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bip -d prod"]
      interval: 5s
      timeout: 5s
      retries: 5

networks:
  makuro-network:
    external: true
```

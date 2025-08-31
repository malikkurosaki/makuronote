Dokcerfile

```Dockerfile
# Dockerfile.dev
FROM oven/bun:latest
WORKDIR /app

# Install git supaya bisa clone
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# Clone repo (keep .git supaya bisa git pull)
RUN git clone https://wibugit.wibudev.com/bip/whatsapp-server.git .

# Install dependencies pertama kali
RUN bun install --frozen-lockfile

EXPOSE 3000

# Saat container start → update repo & re-install kalau ada perubahan
CMD sh -c "git pull && bun install --frozen-lockfile && bun run start"
```

compose.yml

```yml
services:
  jenna-wa:
    build:
      context: .
      dockerfile: Dockerfile
    image: jenna-wa
    restart: unless-stopped
    environment:
      - DATABASE_URL="postgres://xxx:xxx@jenna-wa-postgres:5432/jenna-wa"
      - BUN_PUBLIC_BASE_URL="http://localhost:3000"
      - PORT=3000
      - JWT_SECRET="xxx"
      - WA_AUTH_DIR=".auth"
    ports:
      - "3000:3000"
    networks:
      - makuro-network
    depends_on:
      jenna-wa-postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
  jenna-wa-postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=jenna-wa
    volumes:
      - jenna-wa-postgres_data:/var/lib/postgresql/data
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bip -d jenna-wa"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  jenna-wa-postgres_data:
networks:
  makuro-network:
    external: true


```

Dockerfile

```Dockerfile
FROM ubuntu:22.04

# Install dependencies + vi + docker cli
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
    && mv /root/.bun/bin/bunx /usr/local/bin/bunx \
    && bun --version

WORKDIR /app

# Copy deploy script ke PATH global
COPY deploy /usr/local/bin/deploy
RUN chmod +x /usr/local/bin/deploy

# Use exec form (better signal handling)
CMD ["sh", "-c", "if [ -d './current' ] && [ -f './current/package.json' ]; then cd current && bun start; else echo 'No ./current with package.json found, container idle...' && tail -f /dev/null; fi"]
```

compose.yml

```yml
services:
  jenna-wa:
    image: bip/prod:latest
    container_name: jenna-wa
    restart: unless-stopped
    volumes:
      - ./data/jenna-wa:/app
    networks:
      - makuro-network
    depends_on:
      jenna-wa-postgres: 
        condition: service_healthy
    environment:
      # container env
      - GIT_URL=https://wibugit.wibudev.com/bip/whatsapp-server.git
      - BRANCH=main
      - IS_DB_PUSH=true
      - IS_DB_SEED=true
      - IS_BUILD=true
      - IS_CACHE=true
      # app env
      - NODE_ENV=production
      - DATABASE_URL=postgres://bip:Production_123@jenna-wa-postgres:5432/jenna-wa
      - BUN_PUBLIC_BASE_URL=https://cld-dkr-makuro-jenna-wa2.wibudev.com
      - PORT=3000
      - JWT_SECRET=
      - WA_AUTH_DIR=/app/.auth
      - FLOWISE_API_URL=https://cloud-aiflow.wibudev.com/api/v1
      - FLOWISE_API_KEY=
      - GROQ_API_KEY=

  jenna-wa-postgres:
    image: postgres:16
    container_name: jenna-wa-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=jenna-wa
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bip -d jenna-wa"]
      interval: 5s
      timeout: 5s
      retries: 5

networks:
  makuro-network:
    external: true

```

deploy

```
#!/usr/bin/env bash
set -euo pipefail

# =====================================================
# Deploy Script WhatsApp Server (dijalankan di dalam container prod)
# =====================================================

log() {
    echo "[ $(date '+%Y-%m-%d %H:%M:%S') ] $*"
}

# --- Persiapan ---
WORKDIR="/app"
NEW_DIR="$WORKDIR/current-new"
OLD_DIR="$WORKDIR/current-old"
CURR_DIR="$WORKDIR/current"

# --- Deploy ---
log "🚀 Mulai proses deploy..."

if [ -d "$NEW_DIR" ]; then
    log "hapus folder current-new ..."
    rm -rf "$NEW_DIR"
fi

log "git clone $BRANCH ..."
git clone --depth 1 --branch "$BRANCH" "$GIT_URL" "$NEW_DIR"

# --- Cache node_modules ---
if [ "$IS_CACHE" = "true" ] && [ -d "$OLD_DIR/node_modules" ]; then
    log "copy node_modules ..."
    cp -r "$OLD_DIR/node_modules" "$NEW_DIR/"
fi

cd "$NEW_DIR"

# --- Install dependencies ---
if [ "$IS_CACHE" = "true" ] && [ -f "$OLD_DIR/bun.lock" ]; then
    log "using cached dependencies ..."
    bun install --frozen-lockfile
else
    bun install
fi

# --- Database ---
if [ "$IS_DB_PUSH" = "true" ]; then
    log "prisma db push ..."
    bun x prisma db push
fi

if [ "$IS_DB_SEED" = "true" ]; then
    log "seeding database ..."
    bun x prisma db seed
fi

# --- Build ---
if [ "$IS_BUILD" = "true" ]; then
    log "building app ..."
    bun run build
fi

# --- Rotasi direktori ---
if [ -d "$OLD_DIR" ]; then
    log "hapus current-old ..."
    rm -rf "$OLD_DIR"
fi

if [ -d "$CURR_DIR" ]; then
    log "backup current -> current-old ..."
    mv "$CURR_DIR" "$OLD_DIR"
fi

log "deploy current-new -> current ..."
mv "$NEW_DIR" "$CURR_DIR"

# --- Restart service ---
log "restart service via docker compose ..."
```

run-deploy

```
docker exec jenna-wa deploy
```


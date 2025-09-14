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

# Use exec form (better signal handling)
CMD ["sh", "-c", "if [ -d './current' ] && [ -f './current/package.json' ]; then cd current && bun start; else echo 'No ./current with package.json found, container idle...' && tail -f /dev/null; fi"]

```

compose.yml

```yml
services:
  prod:
    image: bip/prod:latest
    container_name: prod
    restart: unless-stopped
    volumes:
      - ./data/prod:/app
    networks:
      - makuro-network
    depends_on:
      prod-postgres: 
        condition: service_healthy
    environment:
      # contoh env tambahan (opsional, bisa ditaruh di ./data/prod/.env juga)
      NODE_ENV: production
      DATABASE_URL: postgres://bip:Production_123@prod-postgres:5432/prod

  prod-postgres:
    image: postgres:16
    container_name: prod-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: bip
      POSTGRES_PASSWORD: Production_123
      POSTGRES_DB: prod
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

# --- Konfigurasi ---
GIT_URL="https://wibugit.wibudev.com/bip/whatsapp-server.git"
ENV_FILE="/app/.env"
BRANCH="main"
SERVICE_NAME="prod"   # nama service di docker-compose.yml

IS_DB_PUSH=true
IS_DB_SEED=true
IS_BUILD=true
IS_CACHE=true

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

if [ ! -f "$ENV_FILE" ]; then
    log "❌ ENV_FILE tidak ditemukan: $ENV_FILE"
    exit 1
fi

log "git clone $BRANCH ..."
git clone --depth 1 --branch "$BRANCH" "$GIT_URL" "$NEW_DIR"

log "copy .env ..."
cp "$ENV_FILE" "$NEW_DIR/.env"

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
log "restart service $SERVICE_NAME via docker compose ..."

```

run-deploy

```
#!/usr/bin/env bash
set -euo pipefail

ENV_DEPLOY=.env.deploy
FILE_DEPLOY=deploy
SERVICE_NAME=prod

if [ ! -f "$ENV_DEPLOY" ]; then
    echo "ENV_DEPLOY not found: $ENV_DEPLOY"
    exit 1
fi

if [ ! -f "$FILE_DEPLOY" ]; then
    echo "FILE_DEPLOY not found: $FILE_DEPLOY"
    exit 1
fi

echo "copy .env.deploy , deploy"
cp "$ENV_DEPLOY" data/$SERVICE_NAME/.env
cp "$FILE_DEPLOY" data/$SERVICE_NAME/$FILE_DEPLOY

docker exec -it $SERVICE_NAME ./$FILE_DEPLOY

echo "Deployed $SERVICE_NAME"

echo "restart service $SERVICE_NAME ..."
docker restart $SERVICE_NAME
```

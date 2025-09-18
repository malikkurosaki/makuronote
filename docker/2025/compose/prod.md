Dockerfile

```Dockerfile
FROM ubuntu:22.04

# Install dependencies
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

# Install pm2
RUN npm install -g pm2

WORKDIR /app

# Copy deploy script
COPY deploy /usr/local/bin/deploy
RUN chmod +x /usr/local/bin/deploy

# Use pm2-runtime (Docker-friendly)
CMD ["sh", "-c", "\
  if [ -d './current' ] && [ -f './current/package.json' ]; then \
    cd current && pm2-runtime bun -- start; \
  else \
    echo 'No ./current with package.json found, container idle...' && tail -f /dev/null; \
  fi"]
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
      # app env
      - NODE_ENV=production
      - DATABASE_URL=postgres://bip:Production_123@jenna-wa-postgres:5432/jenna-wa
      - BUN_PUBLIC_BASE_URL=https://office4-dkr-makuro-jenna-wa.wibudev.com
      - PORT=3000
      - JWT_SECRET=super_sangat_rahasia_sekali
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

# --- Default Flags ---
IS_DB_PUSH=false
IS_DB_SEED=false
IS_BUILD=true
IS_CACHE=true

# --- Parse args ---
COMMAND=${1:-""}
shift || true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db-push) IS_DB_PUSH=true ;;
    --seed) IS_DB_SEED=true ;;
    --build) IS_BUILD=true ;;
    --no-build) IS_BUILD=false ;;   # biar fleksibel
    --cache) IS_CACHE=true ;;
    --no-cache) IS_CACHE=false ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

# =====================================================
# Fungsi Deploy Start
# =====================================================
deploy_start() {
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
  log "restart service ..."
  pm2 restart all
}

# =====================================================
# Fungsi Deploy Restart
# =====================================================
deploy_restart() {
  log "♻️ Restart service tanpa deploy..."
  pm2 restart all
}

# =====================================================
# Main
# =====================================================
case "$COMMAND" in
  start)
    deploy_start
    ;;
  restart)
    deploy_restart
    ;;
  *)
    echo "Usage: deploy {start|restart} [--db-push] [--seed] [--build|--no-build] [--cache|--no-cache]"
    exit 1
    ;;
esac
```

run-deploy

```
docker exec jenna-wa deploy start
```


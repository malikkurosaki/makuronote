compose.yml

```yml
services:
  sort-docker-proxy:
    image: tecnativa/docker-socket-proxy
    container_name: sort-proxy
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      CONTAINERS: 1
      POST: 1
      PING: 1
    networks:
      - sort
  sort-dev:
    image: bip/dev:latest
    build:
      dockerfile: Dockerfile
      context: .
      target: dev
    container_name: sort-dev
    restart: unless-stopped
    volumes:
      - ./data/app:/app
      - ./data/ssh/authorized_keys:/home/bip/.ssh/authorized_keys:ro
    networks:
      - sort
  sort-prod:
    build:
      dockerfile: Dockerfile
      context: .
      target: prod
    image: bip/prod:latest
    container_name: sort-prod
    restart: unless-stopped
    volumes:
      - ./data/app:/app
    networks:
      - sort
  sort-frpc:
    image: snowdreamtech/frpc:latest
    container_name: sort-frpc
    restart: always
    volumes:
      - ./data/frpc/frpc.toml:/etc/frp/frpc.toml:ro
    networks:
      - sort
networks:
  sort:
    driver: bridge
```

deploy

```sh
#!/usr/bin/env bash
set -euo pipefail

# =====================================================
# Deploy Script WhatsApp Server (dijalankan di dalam container prod)
# =====================================================

CONFIG_FILE="/app/.deploy.conf"
ENV_FILE="/app/.env"
DOCKER_HOST_PROXY=""

# --- Default config ---
GIT_URL_DEFAULT=""
BRANCH_DEFAULT=""
SERVICE_DEFAULT=""

# =====================================================
# Utils
# =====================================================
log() {
    echo "[ $(date '+%Y-%m-%d %H:%M:%S') ] $*"
}

# =====================================================
# Load config
# =====================================================
if [ ! -f "$CONFIG_FILE" ]; then
    # Kalau ada env DEPLOY_SERVICE, jadikan default SERVICE
    SERVICE_DEFAULT="${DEPLOY_SERVICE:-}"
    cat > "$CONFIG_FILE" <<EOF
GIT_URL="$GIT_URL_DEFAULT"
BRANCH="$BRANCH_DEFAULT"
SERVICE="$SERVICE_DEFAULT"
EOF
    log "⚠️  File .deploy.conf belum ada ($CONFIG_FILE), membuat dengan default"
fi

# Source config
# shellcheck disable=SC1090
source "$CONFIG_FILE"

# Kalau SERVICE kosong, fallback ke DEPLOY_SERVICE
if [ -z "${SERVICE:-}" ] && [ -n "${DEPLOY_SERVICE:-}" ]; then
    SERVICE="$DEPLOY_SERVICE"
fi

# Set docker proxy kalau SERVICE sudah ada
if [ -n "${SERVICE:-}" ]; then
    DOCKER_HOST_PROXY="tcp://$SERVICE-docker-proxy:2375"
fi

ensure_config() {
    if [ -z "${GIT_URL:-}" ] || [ -z "${BRANCH:-}" ] || [ -z "${SERVICE:-}" ]; then
        log "⚠️  Config tidak lengkap, pastikan ada di $CONFIG_FILE"
        exit 1
    fi
}

# =====================================================
# Fungsi Edit Config
# =====================================================
edit_config() {
    vi "$CONFIG_FILE"
    log "✅ Perubahan tersimpan di $CONFIG_FILE"
}

# =====================================================
# Fungsi Edit .env
# =====================================================
edit_env() {
    vi "$ENV_FILE"
    log "✅ Perubahan tersimpan di $ENV_FILE"
}

# =====================================================
# Fungsi Show .env
# =====================================================
show_env() {
    if [ -f "$ENV_FILE" ]; then
        echo "=== 📄 Isi $ENV_FILE ==="
        cat "$ENV_FILE"
        echo "========================="
    else
        echo "⚠️  File .env belum ada ($ENV_FILE)"
    fi
}

show_log() {
   docker -H "$DOCKER_HOST_PROXY" logs "$SERVICE-prod"
}

# =====================================================
# Direktori Deploy
# =====================================================
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
    --no-build) IS_BUILD=false ;;
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
  ensure_config

  log "🚀 Mulai proses deploy..."
  log "Gunakan repo: $GIT_URL (branch: $BRANCH, service: $SERVICE)"

  if [ -d "$NEW_DIR" ]; then
      log "hapus folder current-new ..."
      rm -rf "$NEW_DIR"
  fi

  log "git clone ..."
  git clone --depth 1 --branch "$BRANCH" "$GIT_URL" "$NEW_DIR"

  if [ -f "$ENV_FILE" ]; then
      log "copy .env ..."
      cp "$ENV_FILE" "$NEW_DIR/"
  fi

  if [ "$IS_CACHE" = "true" ] && [ -d "$OLD_DIR/node_modules" ]; then
      log "copy node_modules ..."
      cp -r "$OLD_DIR/node_modules" "$NEW_DIR/"
  fi

  if [ "$IS_CACHE" = "true" ] && [ -d "$OLD_DIR/generated/prisma" ]; then
      log "copy prisma ..."
      mkdir -p "$NEW_DIR/generated"
      cp -r "$OLD_DIR/generated/prisma" "$NEW_DIR/generated/"
  fi

  cd "$NEW_DIR"

  if [ "$IS_CACHE" = "true" ] && [ -f "$OLD_DIR/bun.lock" ]; then
      log "using cached dependencies ..."
      bun install --frozen-lockfile
  else
      bun install
  fi

  if [ "$IS_DB_PUSH" = "true" ]; then
      log "prisma db push ..."
      bun x prisma db push
  fi

  if [ "$IS_DB_SEED" = "true" ]; then
      log "seeding database ..."
      bun x prisma db seed
  fi

  if [ "$IS_BUILD" = "true" ]; then
      log "building app ..."
      bun run build
  fi

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

  log "restart service ..."
  docker -H "$DOCKER_HOST_PROXY" restart "$SERVICE-prod"
}

# =====================================================
# Fungsi Deploy Restart
# =====================================================
deploy_restart() {
  ensure_config
  log "restart service ..."
  docker -H "$DOCKER_HOST_PROXY" restart "$SERVICE-prod"
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
  config)
    edit_config
    ;;
  env)
    edit_env
    ;;
  log)
    show_log
    ;;
  show-env)
    show_env
    ;;
  show-config)
    echo "📌 Git URL : $GIT_URL"
    echo "📌 Branch  : $BRANCH"
    echo "📌 Service : $SERVICE"
    ;;
  *)
    echo "Usage: deploy {start|restart|config|env|show-env|show-config} [--db-push] [--seed] [--build|--no-build] [--cache|--no-cache]"
    exit 1
    ;;
esac
```

Dockerfile

```ini
FROM ubuntu:22.04 AS dev

ENV DEBIAN_FRONTEND=noninteractive

# --- Install runtime dependencies ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git unzip ca-certificates openssh-server bash tini vim docker.io tmux \
    && rm -rf /var/lib/apt/lists/*

# --- Install Node.js 22 ---
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && cp /root/.bun/bin/bun /usr/local/bin/bun \
    && cp /root/.bun/bin/bunx /usr/local/bin/bunx \
    && bun --version

# --- Create non-root user `bip` ---
ARG SSH_USER=bip
RUN useradd -ms /bin/bash $SSH_USER \
    && mkdir -p /home/$SSH_USER/.ssh \
    && chmod 700 /home/$SSH_USER/.ssh \
    && chown -R $SSH_USER:$SSH_USER /home/$SSH_USER/.ssh

# --- Configure SSH ---
RUN mkdir -p /var/run/sshd \
    && sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config \
    && echo "AllowUsers $SSH_USER" >> /etc/ssh/sshd_config

# Copy deploy script (milik user bip)
COPY --chown=$SSH_USER:$SSH_USER deploy /usr/local/bin/deploy
RUN chmod +x /usr/local/bin/deploy

# Authorized keys mount point
VOLUME ["/home/$SSH_USER/.ssh"]

# Expose SSH port
EXPOSE 22

# Use Tini as entrypoint for signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Start SSH daemon in foreground
CMD ["/usr/sbin/sshd", "-D"]

FROM ubuntu:22.04 AS prod

ENV DEBIAN_FRONTEND=noninteractive

# --- Install runtime dependencies ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git unzip ca-certificates bash tini \
    && rm -rf /var/lib/apt/lists/*

# --- Install Node.js 22 ---
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && cp /root/.bun/bin/bun /usr/local/bin/bun \
    && cp /root/.bun/bin/bunx /usr/local/bin/bunx \
    && bun --version

# --- Set working dir ---
WORKDIR /app/current

# Expose port (ubah sesuai app)
EXPOSE 3000

# Use Tini as entrypoint for signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["bun", "run", "start"]
```

gen

```sh
#!/bin/bash

echo "Generating directory..."
mkdir -p data data/dev data/prod data/postgres data/frpc data/ssh

echo "Generating authorized_keys..."
touch data/ssh/authorized_keys

echo "Generating frpc.toml..."
touch data/frpc/frpc.toml

echo "Generating frpc.toml content..."
cat > data/frpc/frpc.toml <<EOF
[common]
server_addr = "85.31.224.xxx"
server_port = 7000
transport.tcp_mux = true
transport.pool_count = 5
transport.tls.enable = true

auth_token = ""

[ssh-cld-dkr-staging-hipmi.wibudev.com]
type = tcp
local_ip = hipmi-dev
local_port = 22
remote_port = 5102

[postgres-cld-dkr-staging-hipmi.wibudev.com]
type = tcp
local_ip = hipmi-dev
local_port = 5432
remote_port = 5202

[cld-dkr-staging-hipmi.wibudev.com]
type = http
local_ip = hipmi-prod
local_port = 3000
custom_domains = "cld-dkr-staging-hipmi.wibudev.com"
EOF
```

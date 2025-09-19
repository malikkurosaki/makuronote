dockerfile

```Dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies system
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip ca-certificates git vim bash tini openssh-server \
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

# Install pm2 (global)
RUN npm install -g pm2

# --- Buat user non-root `bip` ---
ARG USERNAME=bip
ARG UID=1000
ARG GID=1000

RUN groupadd -g $GID $USERNAME \
    && useradd -m -u $UID -g $GID -s /bin/bash $USERNAME \
    && mkdir -p /app \
    && chown -R $USERNAME:$USERNAME /app

# Setup SSH untuk user bip
RUN mkdir -p /home/$USERNAME/.ssh \
    && chmod 700 /home/$USERNAME/.ssh \
    && chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh \
    && mkdir -p /var/run/sshd

# authorized_keys -> nanti bind mount dari host
RUN touch /home/$USERNAME/.ssh/authorized_keys \
    && chmod 600 /home/$USERNAME/.ssh/authorized_keys \
    && chown $USERNAME:$USERNAME /home/$USERNAME/.ssh/authorized_keys

# Konfigurasi SSH: disable password login, hanya authorized_keys
RUN sed -i 's/#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config \
    && sed -i 's@#\?AuthorizedKeysFile.*@AuthorizedKeysFile %h/.ssh/authorized_keys@' /etc/ssh/sshd_config

# Copy deploy script (milik user bip)
COPY --chown=$USERNAME:$USERNAME deploy /usr/local/bin/deploy
RUN chmod +x /usr/local/bin/deploy

# --- FIX PM2_HOME ---
RUN mkdir -p /home/$USERNAME/.pm2 && chown -R $USERNAME:$USERNAME /home/$USERNAME/.pm2
ENV PM2_HOME=/home/$USERNAME/.pm2

# Ecosystem file
RUN mkdir -p /etc/pm2 && cat > /etc/pm2/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: "bip-app",
      script: "bun",
      args: "run start",
      cwd: "/app/current",
      env: {
        NODE_ENV: "production"
      }
    }
  ],
};
EOF

WORKDIR /app
EXPOSE 22

# Start sshd + pm2-runtime
CMD ["/usr/bin/tini", "--", "bash", "-c", "\
  /usr/sbin/sshd -D & \
  export HOME=/home/bip && \
  exec su -s /bin/bash -c 'pm2-runtime start /etc/pm2/ecosystem.config.js' bip \
"]
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
      - ./data/ssh/authorized_keys:/home/bip/.ssh/authorized_keys:ro
    networks:
      - makuro-network
    ports:
      - "3001:22"
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

CONFIG_FILE="/app/.deploy.conf"

# --- Default config ---
GIT_URL_DEFAULT="https://github.com/username/repo.git"
BRANCH_DEFAULT="main"

# Load config kalau ada
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    GIT_URL="$GIT_URL_DEFAULT"
    BRANCH="$BRANCH_DEFAULT"
fi

log() {
    echo "[ $(date '+%Y-%m-%d %H:%M:%S') ] $*"
}

save_config() {
    cat > "$CONFIG_FILE" <<EOF
GIT_URL="$GIT_URL"
BRANCH="$BRANCH"
EOF
    log "✅ Konfigurasi tersimpan di $CONFIG_FILE"
}

edit_config() {
    echo "=== Konfigurasi Sekarang ==="
    echo "GIT_URL: $GIT_URL"
    echo "BRANCH : $BRANCH"
    echo "============================"
    read -rp "Masukkan Git URL baru (Enter untuk tetap): " new_url
    read -rp "Masukkan Branch baru (Enter untuk tetap): " new_branch

    if [ -n "$new_url" ]; then GIT_URL="$new_url"; fi
    if [ -n "$new_branch" ]; then BRANCH="$new_branch"; fi

    save_config
}

# --- Direktori ---
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
  log "🚀 Mulai proses deploy..."
  log "Gunakan repo: $GIT_URL (branch: $BRANCH)"

  if [ -d "$NEW_DIR" ]; then
      log "hapus folder current-new ..."
      rm -rf "$NEW_DIR"
  fi

  log "git clone ..."
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
  log "restart service ..."
  pm2 startOrReload /etc/pm2/ecosystem.config.js --env production
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
  show-config)
    echo "📌 Git URL: $GIT_URL"
    echo "📌 Branch : $BRANCH"
    ;;
  *)
    echo "Usage: deploy {start|restart|config|show-config} [--db-push] [--seed] [--build|--no-build] [--cache|--no-cache]"
    exit 1
    ;;
esac
```

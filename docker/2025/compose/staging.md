compose.yml

```yml
x-memory: &default-memory
  mem_limit: 4g
  memswap_limit: 20g
  environment:
    NODE_OPTIONS: "--max-old-space-size=4029"

services:
  staging-bagas:
    image: bip/staging:latest
    container_name: staging-bagas
    restart: unless-stopped
    networks:
      - staging
    volumes:
      - ./data/bagas/authorized_keys:/home/staging/.ssh/authorized_keys:ro
      - ./data/bagas/apps:/home/staging/apps
    healthcheck:
      test: ["CMD", "nc", "-z", "localhost", "22"]
      interval: 30s
      timeout: 5s
      retries: 3
    cpus: 1.0
    <<: *default-memory

  staging-amel:
    image: bip/staging:latest
    container_name: staging-amel
    restart: unless-stopped
    networks:
      - staging
    volumes:
      - ./data/amel/authorized_keys:/home/staging/.ssh/authorized_keys:ro
      - ./data/amel/apps:/home/staging/apps
    healthcheck:
      test: ["CMD", "nc", "-z", "localhost", "22"]
      interval: 30s
      timeout: 5s
      retries: 3
    cpus: 1.0
    <<: *default-memory

  staging-nico:
    image: bip/staging:latest
    container_name: staging-nico
    restart: unless-stopped
    networks:
      - staging
    volumes:
      - ./data/nico/authorized_keys:/home/staging/.ssh/authorized_keys:ro
      - ./data/nico/apps:/home/staging/apps
    healthcheck:
      test: ["CMD", "nc", "-z", "localhost", "22"]
      interval: 30s
      timeout: 5s
      retries: 3
    cpus: 1.0
    <<: *default-memory

  staging-postgres:
    image: postgres:16
    container_name: staging-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: bip
      POSTGRES_PASSWORD: Production_123
      POSTGRES_DB: stagingdb
    networks:
      - staging
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "bip", "-d", "stagingdb"]
      interval: 30s
      timeout: 30s
      retries: 5
    cpus: 1.0
    <<: *default-memory

  staging-frpc:
    image: snowdreamtech/frpc:latest
    container_name: staging-frpc
    restart: unless-stopped
    volumes:
      - ./data/frpc/frpc.toml:/etc/frp/frpc.toml:ro
    networks:
      - staging
    cpus: 1.0
    <<: *default-memory

  staging-netdata:
    image: netdata/netdata:latest
    container_name: staging-netdata
    restart: unless-stopped
    networks:
      - staging
    cap_add:
      - SYS_PTRACE
    security_opt:
      - apparmor=unconfined
    environment:
      NETDATA_CREDENTIAL_USER: wibu
      NETDATA_CREDENTIAL_PASSWORD: Production_123
      POSTGRES_USER: bip
      POSTGRES_PASSWORD: Production_123
      POSTGRES_HOST: staging-postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: stagingdb
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro 
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - ./data:/host/data:ro 
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
    <<: *default-memory

networks:
  staging:
    external: true


```

Dockerfile

```Dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Update & install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    build-essential \
    openssh-server \
    ca-certificates \
    bash \
    netcat \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Setup SSH
RUN mkdir /var/run/sshd \
    && useradd -ms /bin/bash staging \
    && echo "staging:Production_123" | chpasswd

# Configure SSH: disable password, allow only key-based
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config \
    && sed -i 's|#AuthorizedKeysFile.*|AuthorizedKeysFile .ssh/authorized_keys|' /etc/ssh/sshd_config

# Install NVM, Node.js 22, npm, pm2
USER staging
WORKDIR /home/staging
ENV NVM_DIR=/home/staging/.nvm
RUN mkdir -p $NVM_DIR \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install 22 \
    && nvm alias default 22 \
    && npm install -g pm2

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Setup bashrc
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> /home/staging/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/staging/.bashrc \
    && echo 'export PATH="$HOME/.bun/bin:$PATH"' >> /home/staging/.bashrc

# Create default dirs & ssh dir
RUN mkdir -p /home/staging/.ssh /home/staging/.pm2 /home/staging/.bun \
    && chmod 700 /home/staging/.ssh

# Switch back root to fix perms
USER root
RUN chown -R staging:staging /home/staging

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
```
atur permisi untuk ssh `authorized_keys` `chmod 6000 ./data.../authorized_keys`

semua dir bind volume harus dibuat manual terlebih dahulu

dan juga untuk frpc
`./data/frpc/frpc.toml`


deploy

```sh
#!/bin/bash
set -euo pipefail

# ====== FUNCTIONS ======
log() {
    echo "[`date '+%Y-%m-%d %H:%M:%S'`] $1"
}

check_var() {
    if [ -z "${!1:-}" ]; then
        log "ERROR: $1 is not set in .env.deploy"
        exit 1
    fi
}

rollback() {
    log "⚠️ Rolling back to old release..."
    if [ -d "$RELEASE-old" ]; then
        rm -rf "$RELEASE"
        mv "$RELEASE-old" "$RELEASE"
        log "Rollback complete!"
        pm2 delete "$APP_NAME" || true
        PORT="$PORT" pm2 start "bun --bun next start" --name "$APP_NAME"
    else
        log "No old release to rollback!"
    fi
    exit 1
}

# ====== LOAD ENV ======
DEPLOY_ENV=".env.deploy"

if [ ! -f "$DEPLOY_ENV" ]; then
    log "ERROR: $DEPLOY_ENV not found!"
    exit 1
fi

set -a
source "$DEPLOY_ENV"
set +a

# ====== VALIDATE CONFIG ======
check_var APP_NAME
check_var GIT_URL
check_var BRANCH
check_var PORT

USE_CACHE="${USE_CACHE:-false}"

# ====== CONFIG PATH ======
WORKING_DIR="$PWD"
RELEASE="$WORKING_DIR/release"
RELEASE_NEW="$WORKING_DIR/release-new"
CACHE_DIR="$WORKING_DIR/release-cache"

mkdir -p "$CACHE_DIR"

# ====== CLEAN OLD NEW FOLDER ======
if [ -d "$RELEASE_NEW" ]; then
    log "Removing old release-new folder..."
    rm -rf "$RELEASE_NEW"
fi

if [ -d "$RELEASE-old" ]; then
    log "Removing old backup folder..."
    rm -rf "$RELEASE-old"
fi

# ====== CLONE REPO ======
log "Cloning branch '$BRANCH' from $GIT_URL..."
git clone --depth 1 --branch "$BRANCH" "$GIT_URL" "$RELEASE_NEW"

if [ -f ".env" ]; then
    cp .env "$RELEASE_NEW/.env"
else
    log "WARNING: .env not found in current directory. Skipping copy."
fi

# ====== RESTORE CACHE ======
if [ "$USE_CACHE" = "true" ] && [ -d "$CACHE_DIR/node_modules" ]; then
    log "Restoring cached node_modules..."
    cp -r "$CACHE_DIR/node_modules" "$RELEASE_NEW/"
fi

# ====== INSTALL DEPENDENCIES & MIGRATE DB ======
log "Installing dependencies..."
cd "$RELEASE_NEW"

if [ "$USE_CACHE" = "true" ]; then
    log "Using cached dependencies..."
    bun install --no-clean
else
    bun install
fi

log "DB_PUSH=${DB_PUSH:-false}, DB_SEED=${DB_SEED:-false}"

if [ "${DB_PUSH:-false}" = "true" ]; then
    log "Running Prisma DB push..."
    bunx prisma db push
fi

if [ "${DB_SEED:-false}" = "true" ]; then
    log "Seeding database..."
    bunx prisma db seed
fi

log "Building app..."
if ! bun run build; then
    log "Build failed! Aborting deployment."
    exit 1
fi

# ====== SAVE CACHE ======
if [ "$USE_CACHE" = "true" ]; then
    log "Saving node_modules to cache..."
    rm -rf "$CACHE_DIR/node_modules"
    cp -r node_modules "$CACHE_DIR/"
fi

# ====== BACKUP OLD APP ======
if [ -d "$RELEASE" ]; then
    log "Backing up old release..."
    mv "$RELEASE" "$RELEASE-old"
fi

# ====== DEPLOY NEW APP ======
log "Deploying new release..."
mv "$RELEASE_NEW" "$RELEASE"

# ====== RESTART APP WITH ROLLBACK ======
log "Restarting app with PM2 on port $PORT..."
pm2 delete "$APP_NAME" || true

if ! PORT="$PORT" pm2 start "bun --bun next start" --name "$APP_NAME"; then
    log "App failed to start!"
    rollback
fi

# ====== CLEAN OLD APP ======
if [ -d "$RELEASE-old" ]; then
    log "Removing old backup..."
    rm -rf "$RELEASE-old"
fi

log "✅ Deployment complete for $APP_NAME on branch '$BRANCH' at port $PORT! (USE_CACHE=$USE_CACHE)"
```

.env.deploy

```.ini
APP_NAME=desa-plus
GIT_URL=https://wibugit.wibudev.com/bip/sistem-desa-mandiri.git
BRANCH=staging
PORT=3000
DB_PUSH=true
DB_SEED=true
USE_CACHE=true
```

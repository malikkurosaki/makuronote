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

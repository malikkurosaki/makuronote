# ARCH builder

builder.sh

```sh
docker buildx build --platform linux/arm64 -t wibuntu:arm64 --load .
docker buildx build --platform linux/amd64 -t wibuntu:amd64 --load .
```

Dockerfile

```Dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=lts/*

RUN apt-get update && apt-get upgrade -y && \
  apt-get install -y \
    curl \
    gnupg2 \
    unzip \
    ca-certificates \
    git \
    build-essential \
    bash \
    jq \
    software-properties-common && \
  add-apt-repository ppa:rmescandon/yq -y && \
  apt-get update && \
  apt-get install -y yq && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Install NVM + Node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
  . "$NVM_DIR/nvm.sh" && \
  nvm install "$NODE_VERSION" && \
  nvm use "$NODE_VERSION" && \
  nvm alias default "$NODE_VERSION"

# Set PATH agar node bisa dikenali
ENV PATH="$NVM_DIR/versions/node/$(bash -c '. \"$NVM_DIR/nvm.sh\" && nvm version \"$NODE_VERSION\"' | xargs -I {} echo {})/bin:$PATH"

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

CMD [ "bash" ]


```

```yml
services:
  jenna-wa-postgres:
    image: postgres:16
    restart: unless-stopped
    container_name: jenna-wa-postgres
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=jenna-wa
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bip -d jenna-wa"]
      interval: 5s
      timeout: 5s
      retries: 5

  jenna-wa:
    build:
      context: .
      dockerfile_inline: |
        FROM node:22

        WORKDIR /app

        # Install Bun
        RUN curl -fsSL https://bun.sh/install | bash \
            && mv /root/.bun/bin/bun /usr/local/bin/bun \
            && mv /root/.bun/bin/bunx /usr/local/bin/bunx

        # Expose port
        EXPOSE 3000

    image: jenna-wa
    restart: unless-stopped
    container_name: jenna-wa
    environment:
      - DATABASE_URL=postgresql://bip:Production_123@jenna-wa-postgres:5432/jenna-wa
      - BUN_PUBLIC_BASE_URL=http://jenna-wa:3000
      - JWT_SECRET=super_sangat_rahasia_sekali
      - WA_AUTH_DIR=.auth
      - PORT=3000
    networks:
      - makuro-network
    depends_on:
      jenna-wa-postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - ./jenna-wa_data:/app
    command: >
      sh -c '
        set -e
        : $${APP_NAME:=jenna-wa}

        if [ -d /app/$$APP_NAME-new ]; then
          echo "Cloning repository..."
          rm -rf /app/$$APP_NAME-new
        fi

        git clone --depth 1 --branch main https://wibugit.wibudev.com/bip/whatsapp-server.git $$APP_NAME-new

        if [ -d /app/$$APP_NAME/.auth ]; then
          echo "Moving .auth..."
          cp -r /app/$$APP_NAME/.auth /app/$$APP_NAME-new/.auth
        fi

        if [ -d /app/$$APP_NAME/node_modules ]; then
          echo "Moving node_modules..."
          cp -r /app/$$APP_NAME/node_modules /app/$$APP_NAME-new/node_modules
        fi

        if [ -d /app/$$APP_NAME/generated/prisma ]; then
          mkdir -p /app/$$APP_NAME-new/generated/prisma
          echo "Moving generated/prisma..."
          cp -r /app/$$APP_NAME/generated/prisma /app/$$APP_NAME-new/generated/prisma
        fi

        if [ -f /app/$$APP_NAME/bun.lock ]; then
          echo "Moving bun.lock..."
          cp /app/$$APP_NAME/bun.lock /app/$$APP_NAME-new/bun.lock
        fi

        if [ -f /app/$$APP_NAME/seed.lock ]; then
          echo "Moving seed.lock..."
          cp /app/$$APP_NAME/seed.lock /app/$$APP_NAME-new/seed.lock
        fi

        cd /app/$$APP_NAME-new

        echo "📦 Installing dependencies..."
        bun install --frozen-lockfile || { echo "❌ Bun install gagal"; exit 1; }

        bun x prisma db push

        if [ ! -f /app/$$APP_NAME-new/seed.lock ]; then
          echo "⏳ Menjalankan Prisma migrate & seed..."
          bun x prisma db seed
          touch /app/$$APP_NAME-new/seed.lock
          echo "✅ Prisma migration & seeding selesai"
        else
          echo "⚡ Init sudah pernah dijalankan, skip migrate & seed , hapus seed.lock jika perlu seeding ulang"
        fi

        echo "Moving new files..."
        if [ -d /app/$$APP_NAME ]; then
          mv /app/$$APP_NAME /app/$$APP_NAME-old
          rm -rf /app/$$APP_NAME-old
        fi
        mv /app/$$APP_NAME-new /app/$$APP_NAME
        cd /app/$$APP_NAME

        echo "🚀 Menjalankan Bun..."
        bun run start
      '

networks:
  makuro-network:
    external: true
```



```.yml
services:
  jenna-wa-postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=bip
      - POSTGRES_PASSWORD=Production_123
      - POSTGRES_DB=jenna-wa
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    networks:
      - makuro-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bip -d jenna-wa"]
      interval: 5s
      timeout: 5s
      retries: 5

  jenna-wa:
    build:
      context: .
      dockerfile_inline: |
        FROM node:22

        WORKDIR /app

        # Install dependencies untuk git, curl
        RUN apt-get update && apt-get install -y git curl unzip \
            && rm -rf /var/lib/apt/lists/*

        # Install Bun
        RUN curl -fsSL https://bun.sh/install | bash \
            && mv /root/.bun/bin/bun /usr/local/bin/bun \
            && mv /root/.bun/bin/bunx /usr/local/bin/bunx

        # Clone repository
        RUN git clone --depth 1 --branch main https://wibugit.wibudev.com/bip/whatsapp-server.git .

        # Install dependencies (pakai Bun)
        RUN bun install --frozen-lockfile

        # Expose port
        EXPOSE 3000

    image: jenna-wa
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://bip:Production_123@jenna-wa-postgres:5432/jenna-wa
      - BUN_PUBLIC_BASE_URL=http://jenna-wa:3000
      - PORT=3000
      - JWT_SECRET=super_sangat_rahasia_sekali
      - WA_AUTH_DIR=.auth
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
    volumes:
      - ./jenna-wa/.auth:/app/.auth
      - ./jenna-wa/node_modules:/app/node_modules
      - ./jenna-wa/bun.lock:/app/bun.lock
      - ./jenna-wa/.env:/app/.env
    command: >
      sh -c '
        set -e

        # Jalankan Prisma migrate & seed sekali saja
        if [ ! -f /app/.init_done ]; then
          echo "⏳ Menjalankan Prisma migrate & seed..."
          bun x prisma db push
          bun x prisma db seed
          touch /app/.init_done
          echo "✅ Prisma migration & seeding selesai"
        else
          echo "⚡ Init sudah pernah dijalankan, skip migrate & seed"
        fi

        echo "🚀 Menjalankan Bun..."
        bun run start
      '

networks:
  makuro-network:
    external: true


```

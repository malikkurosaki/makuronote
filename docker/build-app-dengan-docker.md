# Build App Dengan Docker

buildcli.sh

```sh
#!/bin/bash
set -euo pipefail

LOCK_FILE="buildcli.lock"
LOG_FILE="build.log"

# Cek apakah ada proses lama masih berjalan
if [ -f "$LOCK_FILE" ]; then
  LOCK_PID=$(cat "$LOCK_FILE")
  echo "❌ Build sedang berjalan (PID: $LOCK_PID). Keluar..."
  exit 1
fi

# Jalankan proses di subshell background
(
  echo $$ > "$LOCK_FILE"
  trap 'rm -f "$LOCK_FILE"' EXIT

  # Load variabel lingkungan
  source .env.config

  docker run --rm \
    --platform "linux/${ARCH}" \
    --name "releases-${APP_NAME}" \
    --env APP_NAME="${APP_NAME}" \
    --env ARCH="${ARCH}" \
    --env IS_DB_PUSH="${IS_DB_PUSH}" \
    --env IS_DB_SEED="${IS_DB_SEED}" \
    --env DATABASE_URL="postgresql://bip:Production_123@db:5432/sistem_desa_mandiri?schema=public" \
    --network makuro-network \
    -v "${PWD}:/app" \
    -w /app \
    "wibuntu:${ARCH}" \
    /bin/bash build.sh
) < /dev/null > "$LOG_FILE" 2>&1 &

echo "🚀 Build berjalan di background. Cek log dengan:"
echo "   tail -f $LOG_FILE"
```


build.sh

```sh
#!/bin/bash
set -e

echo "load nvm source"
source $NVM_DIR/nvm.sh

echo "load env"
source .env

if [ ! -d "releases-${ARCH}" ]; then
  echo "Folder releases-${ARCH} belum ada, melakukan clone..."
  git clone "https://wibugit.wibudev.com/bip/${APP_NAME}.git" "releases-${ARCH}"
else
  echo "Folder releases-${ARCH} sudah ada, skip clone."
fi

echo "cd releases"
cd "releases-${ARCH}"

echo "fetch"
git fetch --all && git checkout staging
git pull origin staging

echo "override next.config.js"
cat <<EOF > next.config.js
module.exports = {
  output: 'standalone',
}
EOF

echo "override next.config.mjs"
cat <<EOF > next.config.mjs
export default {
    output: 'standalone',
}
EOF

echo "bun install"
bun install

# Prisma DB Push jika aktif
if [ "$IS_DB_PUSH" = "true" ]; then
  echo "🔃 Menjalankan prisma db push..."
  bunx prisma db push
else
  echo "⏭️  Melewati prisma db push"
fi

# Prisma DB Seed jika aktif
if [ "$IS_DB_SEED" = "true" ]; then
  echo "🌱 Menjalankan prisma db seed..."
  bunx prisma db seed
else
  echo "⏭️  Melewati prisma db seed"
fi

echo "run build"
bun run build

echo "copy standalone"
cp -r public .next/standalone/ 
cp -r .next/static .next/standalone/.next/

echo "SUCCESS!"

```

.env.config

```ini
APP_NAME=sistem-desa-mandiri
ARCH=arm64
IS_DB_PUSH="true"
IS_DB_SEED="false"
```

Dockerfile

```Dockerfile
# Gunakan base image oven/bun:debian
FROM wibuntu:arm64

# Set working directory di dalam container
WORKDIR /app

# Salin folder dist dari host ke dalam container
COPY dist/ /app

# Ekspose port 3000
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["bun", "server.js"]
```

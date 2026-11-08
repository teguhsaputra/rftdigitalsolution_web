#!/usr/bin/env bash
# Kirim kode terbaru ke VPS Tencent lalu build & restart rftdigitalsolution.com.
# Data (Postgres, MinIO) dan .env di VPS tidak disentuh. Skema Prisma TIDAK otomatis di-push:
# setelah mengubah prisma/schema.prisma jalankan perintah prisma-setup (lihat deploy/docker-compose.prod.yml).
#
# Pakai: ./deploy/deploy.sh   (default: deploy@43.173.51.136, key ~/.ssh/rft-deploy)
set -euo pipefail
HOST="${DEPLOY_HOST:-deploy@43.173.51.136}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/rft-deploy}"
DIR="${DEPLOY_DIR:-/opt/native-apps/rftdigitalsolution_web}"
SSH="ssh -i $KEY -o IdentitiesOnly=yes"
COMPOSE="docker compose -f deploy/docker-compose.prod.yml --env-file .env"
cd "$(dirname "$0")/.."

echo "→ sinkron kode ke $HOST:$DIR"
rsync -az --delete -e "$SSH" \
  --exclude node_modules --exclude .next --exclude .git --exclude .claude --exclude .superpowers \
  --exclude '.env' --exclude '.env.*' \
  --exclude minio_data --exclude dragonfly_data \
  ./ "$HOST:$DIR/"

echo "→ build & restart"
$SSH "$HOST" "cd $DIR && $COMPOSE up -d --build && docker image prune -f >/dev/null"

echo "→ cek kesehatan"
sleep 8
$SSH "$HOST" "docker ps --filter name=native_rft --format '{{.Names}}: {{.Status}}'"

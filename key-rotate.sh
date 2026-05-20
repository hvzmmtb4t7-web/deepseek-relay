#!/usr/bin/env bash
# Rotate client API keys without downtime
# Usage: ./key-rotate.sh
set -euo pipefail

ENV_FILE="${1:-/opt/deepseek-relay/.env}"
NEW_KEY="sk-$(openssl rand -hex 24)"

if [ ! -f "$ENV_FILE" ]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

# Generate backup
cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Add new key to existing keys (comma-separated)
CURRENT_KEYS=$(grep CLIENT_API_KEYS "$ENV_FILE" | cut -d= -f2-)
NEW_KEYS="$CURRENT_KEYS,$NEW_KEY"

# Update .env
sed -i "s/^CLIENT_API_KEYS=.*/CLIENT_API_KEYS=$NEW_KEYS/" "$ENV_FILE"

# Graceful reload (PM2)
pm2 reload deepseek-relay 2>/dev/null || docker compose restart 2>/dev/null || true

echo "✅ New key added: $NEW_KEY"
echo "✅ Backup saved to: ${ENV_FILE}.backup.*"
echo "ℹ️  Old keys still valid — remove them manually when ready"
echo "ℹ️  Wait 10 seconds for the server to reload before using the new key"

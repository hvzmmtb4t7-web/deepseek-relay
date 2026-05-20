#!/usr/bin/env bash
# DeepSeek Relay — 1-Click Production Deploy (Ubuntu/Debian)
# Usage: chmod +x deploy.sh && sudo ./deploy.sh
set -euo pipefail

GREEN='\033[0;32m' YELLOW='\033[1;33m' NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} DeepSeek Relay — Production Deploy${NC}"
echo -e "${GREEN}========================================${NC}"

# ---- 1. System dependencies ----
echo -e "${YELLOW}[1/6] Installing system packages...${NC}"
apt-get update -qq
apt-get install -y -qq curl nginx certbot python3-certbot-nginx

# ---- 2. Node.js 22 (if missing) ----
echo -e "${YELLOW}[2/6] Checking Node.js...${NC}"
if ! command -v node &>/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi

# ---- 3. App directory ----
echo -e "${YELLOW}[3/6] Setting up app...${NC}"
APP_DIR="/opt/deepseek-relay"
mkdir -p "$APP_DIR"
cp server.js package.json package-lock.json "$APP_DIR/"
cp .env "$APP_DIR/" 2>/dev/null || { echo "ERROR: .env not found. Copy .env.example to .env first."; exit 1; }
cd "$APP_DIR"
npm ci --omit=dev

# ---- 4. PM2 process manager ----
echo -e "${YELLOW}[4/6] Installing PM2...${NC}"
npm install -g pm2 2>/dev/null || true
pm2 delete deepseek-relay 2>/dev/null || true
pm2 start server.js --name deepseek-relay --max-memory-restart 200M
pm2 save
pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null || true

# ---- 5. Nginx reverse proxy + SSL ----
echo -e "${YELLOW}[5/6] Configuring nginx...${NC}"
read -rp "Enter your domain (e.g. relay.yourcompany.com): " DOMAIN
cat > "/etc/nginx/sites-available/$DOMAIN" <<NGINX
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }
}
NGINX
ln -sf "/etc/nginx/sites-available/$DOMAIN" /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# ---- 6. SSL certificate ----
echo -e "${YELLOW}[6/6] Getting SSL certificate...${NC}"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" 2>/dev/null || \
certbot --nginx -d "$DOMAIN"

# ---- Done ----
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} ✅ Deploy complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Your relay is running at: ${GREEN}https://$DOMAIN${NC}"
echo -e "Test it: curl https://$DOMAIN/health"
echo -e ""
echo -e "Manage it: pm2 status deepseek-relay"
echo -e "Logs:      pm2 logs deepseek-relay"
echo -e "Restart:   pm2 restart deepseek-relay"

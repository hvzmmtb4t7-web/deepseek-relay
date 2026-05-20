# Production Deployment Guide

Pick your deployment target. Choose **one**.

---

## 🟢 Option A: VPS (Ubuntu/Debian) — Recommended

Works on: Hetzner, DigitalOcean, AWS Lightsail, Vultr, Tencent Cloud HK, Alibaba Cloud HK

### Step 1: Get a server

Any VPS with Ubuntu 22.04+ works. Minimum: 1 CPU, 512MB RAM, 10GB disk.

| Provider | Cheapest plan | Price |
|---|---|---|
| Hetzner (US/DE) | CX22 | ~$4/mo |
| DigitalOcean | Basic Droplet | $6/mo |
| Tencent Cloud HK | Lightweight | ~$5/mo |

### Step 2: Point DNS

Add an A record: `relay.yourdomain.com` → your server IP.

### Step 3: Run deploy script

```bash
# On your server:
git clone https://github.com/YOU/deepseek-relay.git
cd deepseek-relay
cp .env.example .env
nano .env  # Add your DeepSeek API key + set CLIENT_API_KEYS
chmod +x deploy.sh
sudo ./deploy.sh
```

Enter your domain when prompted. Done in ~3 minutes.

### Step 4: Test

```bash
curl https://relay.yourdomain.com/health
# → {"status":"ok","uptime":180,...}
```

---

## 🔵 Option B: Docker (any platform)

```bash
cp .env.example .env
nano .env
docker compose up -d

# Behind nginx:
# Point nginx to http://127.0.0.1:3000, add SSL with certbot
```

---

## 🟡 Option C: Railway / Render (no server needed)

### Railway
1. Fork this repo
2. Connect to Railway
3. Add environment variables from `.env.example`
4. Deploy — Railway gives you a public URL

### Render
1. New Web Service → connect repo
2. Start command: `npm start`
3. Add environment variables
4. Deploy

---

## Post-Deploy Checklist

- [ ] `curl https://your-domain/health` returns OK
- [ ] Set up monitoring (UptimeRobot free tier works)
- [ ] Check PM2 logs: `pm2 logs deepseek-relay`
- [ ] Rotate your `CLIENT_API_KEYS` regularly
- [ ] Monitor your DeepSeek balance at [platform.deepseek.com](https://platform.deepseek.com)

---

## Firewall Setup

```bash
# Only expose 80/443, keep 3000 internal
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Upgrading

```bash
cd /opt/deepseek-relay
git pull
npm ci --omit=dev
pm2 restart deepseek-relay
```

Done. Zero downtime.

---

*Need help? Open a GitHub issue with the `deploy-help` label.*

# Gumroad Product Page Content

## Title
DeepSeek Relay — 1-Click Deploy Pack

## Price
$49 (one-time payment)

## Thumbnail
Generate an AI image: a sleek server rack icon with "DeepSeek Relay" text, dark theme, gradient blue-purple background

---

## Description (copy-paste into Gumroad)

### 🔥 Turn any VPS into a DeepSeek API endpoint in 5 minutes

You get the open-source code. **This pack makes it production-ready.**

---

### What's Included

| File | What It Does |
|------|--------------|
| **`deploy.sh`** | One command → full production deploy (nginx + SSL + PM2) |
| **`balance-monitor.sh`** | Alerts you when DeepSeek balance drops below $10 |
| **`rate-limit.conf`** | Nginx rate limiting — prevent abuse before it starts |
| **`dashboard.html`** | Single-page usage dashboard (drop-in, no build step) |
| **`key-rotate.sh`** | Rotate client API keys without downtime |
| **`docs/DEPLOY.md`** | Step-by-step deployment walkthrough with screenshots |

---

### Why Buy Instead of DIY?

| | Free Repo | Deploy Pack ($49) |
|---|---|---|
| Basic relay | ✅ | ✅ |
| 1-click deploy script | ❌ | ✅ |
| Rate limiting | ❌ | ✅ |
| Balance alerts | ❌ | ✅ |
| Usage dashboard | ❌ | ✅ |
| Key rotation | ❌ | ✅ |
| Support | Community | **Priority (me)** |

---

### Who This Is For

- Indie hackers running AI apps who want to cut API costs 95%
- Small teams tired of managing individual DeepSeek keys
- Developers who want to self-host but hate devops

### Who This Is NOT For

- Enterprises needing enterprise SLAs (talk to DeepSeek directly)
- Someone who enjoys configuring nginx manually

---

### Requirements

- A VPS (any provider: Hetzner, DigitalOcean, Lightsail, Tencent HK — $4-6/mo)
- A domain name
- A DeepSeek API key ([get one free](https://platform.deepseek.com))

---

### Guarantee

If the deploy script doesn't work on your Ubuntu/Debian VPS within 30 minutes, email me and I'll either fix it or refund you. No questions asked.

---

### FAQ

**Q: Is this a subscription?**
A: No. One-time payment. Updates included for 1 year.

**Q: What if DeepSeek API changes?**
A: I update the relay code within 24 hours. You'll get the update.

**Q: Can I use this for my business?**
A: Absolutely. MIT license. Build a SaaS on it.

**Q: What if I have issues?**
A: GitHub issue with `support` label → I reply within 24 hours (Mon-Fri).

---

## Files to Upload to Gumroad

Zip these into `deepseek-relay-deploy-pack-v1.0.zip`:

```
deepseek-relay/
├── server.js              # Relay server (same as open source)
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── deploy.sh              # ⭐ 1-click production deploy
├── balance-monitor.sh     # ⭐ DeepSeek balance alert
├── key-rotate.sh          # ⭐ API key rotation
├── dashboard.html         # ⭐ Usage dashboard
├── rate-limit.conf        # ⭐ Nginx rate limiting
├── docs/
│   └── DEPLOY.md          # ⭐ Full deployment guide
├── README.md
└── LICENSE
```

⭐ = Premium (not in free repo)

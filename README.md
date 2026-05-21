# 🚀 DeepSeek Relay

**Self-hosted DeepSeek API relay — OpenAI compatible. 10x cheaper than GPT-5.5.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](Dockerfile)

---

## Why this exists

DeepSeek V4 is one of the best AI models available — and **insanely cheap**:

| Model | Input ($/1M tokens) | Output ($/1M tokens) |
|---|---|---|
| **DeepSeek V4-Flash** | $0.14 | $0.28 |
| DeepSeek V4-Pro | $0.44 | $0.87 |
| Claude Opus 4.6 | $5.00 | $25.00 |
| GPT-5.5 | $5.00 | $30.00 |

But if you have a team, giving everyone a DeepSeek API key is painful. This relay lets you:

- ✅ **One API key** → share with your whole team
- ✅ **OpenAI compatible** → drop-in replacement (`base_url` change only)
- ✅ **Usage tracking** → see who's using how much
- ✅ **Self-hosted** → your keys, your server, your data
- ✅ **200 lines of code** → read it all in 5 minutes

---

## Quick Start

### Option 1: Node.js (30 seconds)

```bash
git clone https://github.com/YOU/deepseek-relay.git
cd deepseek-relay
cp .env.example .env
# Edit .env — add your DeepSeek API key
npm install
npm start
```

### Option 2: Docker

```bash
cp .env.example .env
# Edit .env first
docker compose up -d
```

### Use it

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer YOUR_CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hello!"}]}'
```

**That's it.** Now point any OpenAI-compatible client to `http://localhost:3000`.

---

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check + usage stats |
| `GET /pricing` | Current pricing info |
| `GET /v1/models` | List available models |
| `POST /v1/chat/completions` | Chat completions (streaming supported) |
| `GET /v1/usage` | Your usage statistics |

---

## Supported Models

- `deepseek-chat` — Fast, general purpose (V4-Flash)
- `deepseek-reasoner` — Deep reasoning (V4-Pro with R1)

---

## Pricing Transparency

We believe in being upfront about costs:

| | Our Default | DeepSeek Official |
|---|---|---|
| Input | $0.17/1M tokens | $0.14/1M tokens |
| Output | $0.35/1M tokens | $0.28/1M tokens |

You can set any price you want in `.env`. The relay adds billing info (`_billing`) to every response so your users always know what they're spending.

---

## Production Deployment

For production, we recommend:

```bash
# Behind nginx with SSL
sudo apt install nginx certbot
# ... (full guide in docs/DEPLOY.md)
```

Or use our **1-Click Deploy Pack** (see below).

---

## 📦 1-Click Deploy Pack — $49

Don't want to figure out nginx, SSL, PM2, and firewall rules yourself?

**[💰 Pay $49 →](https://paypal.me/zj75/49)** &nbsp;|&nbsp; **[⬇️ Download →](https://github.com/hvzmmtb4t7-web/deepseek-relay/releases/download/v1.0/deepseek-relay-deploy-pack-v1.0.zip)**

Includes:
- 📜 Full deployment script (Ubuntu/Debian)
- 🔒 Auto HTTPS via Let's Encrypt
- 📊 Dashboard with usage charts
- 🛡️ Rate limiting + abuse protection
- 📧 Email alerts when balance runs low
- 🆘 Priority GitHub issue support (3 months)

Honor system — pay what you think it's worth. If this saves you an afternoon of devops, consider buying me a coffee ☕

---

## FAQ

**Q: Why not just use OpenRouter?**
A: OpenRouter takes a 5.5% cut on every request and sees all your data. This relay is self-hosted — zero middleman.

**Q: Does it support streaming?**
A: Yes. The relay passes through streaming responses from DeepSeek transparently.

**Q: Can I add more models?**
A: Yes. Edit server.js — it's 200 lines, intentionally simple.

**Q: Is my data safe?**
A: You host it. Your server. Your keys. Your data never touches a third party.

**Q: What if DeepSeek changes their API?**
A: Follow this repo. We update within 24 hours of any breaking change.

---

## Star History

If this project helps you, consider giving it a ⭐ — it helps others find it.

---

## License

MIT — do whatever you want. Build a business on it. Sell it. Just keep the license notice.

---

*Built with ❤️ for the open-source AI community. Not affiliated with DeepSeek.*

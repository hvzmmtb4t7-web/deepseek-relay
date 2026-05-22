# 🚀 DeepSeek Relay · 自托管 API 中继站

**Self-hosted DeepSeek API relay — OpenAI compatible. 比 GPT-5.5 便宜 35 倍。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](Dockerfile)
[![便宜35倍](https://img.shields.io/badge/比GPT--5.5-便宜35倍-red)](https://deepseek.com)

---

## Why this exists

DeepSeek V4 是性价比最高的旗舰模型——能力接近 GPT-5.5/Claude Opus，价格却只有 1/35：

> DeepSeek V4 is one of the best AI models available — and **insanely cheap**:

| 模型 Model | 输入 Input | 输出 Output | 相对成本 vs DeepSeek |
|---|---:|---:|---:|
| **DeepSeek V4-Flash** | $0.14 | $0.28 | 1x（基准） |
| DeepSeek V4-Pro | $0.44 | $0.87 | 3x |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 21x |
| GPT-5.5 | $5.00 | $30.00 | **35x** |

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

## 🔌 接入 AI 编程工具 · Claude Code / Cursor / Cline

所有支持 OpenAI 协议的 AI 编程工具都能直接使用。改 base_url 指向你的中继站即可：

> All OpenAI-compatible coding tools work. Just change `base_url` to point to your relay.

### Claude Code

```bash
export OPENAI_BASE_URL="http://your-server:3000/v1"
export OPENAI_API_KEY="你的客户端Key"
```

### Cursor / Cline / Continue

在设置中将 API Base URL 改为 `http://your-server:3000/v1`，API Key 填入中继站的客户端 Key。

> Settings → API Base URL → `http://your-server:3000/v1`

### 任意 OpenAI SDK

```python
from openai import OpenAI
client = OpenAI(
    base_url="http://your-server:3000/v1",
    api_key="你的客户端Key"
)
```

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

**Q: 多久更新一次？ / How often is it updated?**
A: This project is actively maintained. Breaking API changes are patched within 24 hours. Feature updates are released monthly. ⭐ Star this repo to stay notified.

---

## Star History

If this project helps you, consider giving it a ⭐ — it helps others find it.

---

## License

MIT — do whatever you want. Build a business on it. Sell it. Just keep the license notice.

---

*Built with ❤️ for the open-source AI community. Not affiliated with DeepSeek.*

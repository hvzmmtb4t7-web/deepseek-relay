import "dotenv/config";
import express from "express";

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = process.env.DEEPSEEK_BASE_URL + "/chat/completions";
const PORT = process.env.PORT || 3000;
const CLIENT_KEYS = new Set(
  process.env.CLIENT_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
);
const PRICE_IN = parseFloat(process.env.PRICING_INPUT_PER_1M) || 0.17;
const PRICE_OUT = parseFloat(process.env.PRICING_OUTPUT_PER_1M) || 0.35;

const app = express();
app.use(express.json({ limit: "10mb" }));

// 总用量统计
const stats = { totalTokensIn: 0, totalTokensOut: 0, totalRequests: 0 };

// ========== 中间件：API Key 验证 ==========
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/health" || req.path === "/pricing") return next();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: { message: "Missing API key" } });
  }
  const key = auth.slice(7);
  if (!CLIENT_KEYS.has(key)) {
    return res.status(403).json({ error: { message: "Invalid API key" } });
  }
  next();
});

// ========== 健康检查 ==========
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), stats });
});

// ========== 定价页 ==========
app.get("/pricing", (_req, res) => {
  res.json({
    service: "DeepSeek Relay",
    models: ["deepseek-chat", "deepseek-reasoner"],
    pricing: {
      input_per_1M_tokens: PRICE_IN,
      output_per_1M_tokens: PRICE_OUT,
      currency: "USD",
    },
    compare: {
      deepseek_official_input: 0.14,
      deepseek_official_output: 0.28,
      claude_opus_input: 5.0,
      claude_opus_output: 25.0,
    },
  });
});

// ========== 模型列表（OpenAI 兼容） ==========
app.get("/v1/models", (_req, res) => {
  res.json({
    object: "list",
    data: [
      { id: "deepseek-chat", object: "model", owned_by: "deepseek-relay" },
      { id: "deepseek-reasoner", object: "model", owned_by: "deepseek-relay" },
    ],
  });
});

// ========== 核心：Chat Completions ==========
app.post("/v1/chat/completions", async (req, res) => {
  const startTime = Date.now();
  stats.totalRequests++;

  try {
    const body = req.body;
    const model = body.model || "deepseek-chat";

    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({ ...body, model }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: { message: errText } });
    }

    const data = await response.json();
    const usage = data.usage || {};
    stats.totalTokensIn += usage.prompt_tokens || 0;
    stats.totalTokensOut += usage.completion_tokens || 0;

    // 计算本次请求费用
    const costIn = ((usage.prompt_tokens || 0) / 1_000_000) * PRICE_IN;
    const costOut = ((usage.completion_tokens || 0) / 1_000_000) * PRICE_OUT;
    const latency = Date.now() - startTime;

    // 在响应中附加计费信息
    res.json({
      ...data,
      _billing: {
        cost_usd: +(costIn + costOut).toFixed(6),
        cost_in_usd: +costIn.toFixed(6),
        cost_out_usd: +costOut.toFixed(6),
        latency_ms: latency,
      },
    });
  } catch (err) {
    res.status(502).json({ error: { message: "Upstream error: " + err.message } });
  }
});

// ========== 用量查询 ==========
app.get("/v1/usage", (req, res) => {
  res.json({
    total_requests: stats.totalRequests,
    total_tokens_in: stats.totalTokensIn,
    total_tokens_out: stats.totalTokensOut,
    estimated_cost_in_usd: +(
      (stats.totalTokensIn / 1_000_000) * PRICE_IN
    ).toFixed(4),
    estimated_cost_out_usd: +(
      (stats.totalTokensOut / 1_000_000) * PRICE_OUT
    ).toFixed(4),
    estimated_total_cost_usd: +(
      (stats.totalTokensIn / 1_000_000) * PRICE_IN +
      (stats.totalTokensOut / 1_000_000) * PRICE_OUT
    ).toFixed(4),
  });
});

// ========== 首页 ==========
app.get("/", (_req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DeepSeek Relay — Affordable AI API</title>
<style>
  body { max-width:700px; margin:40px auto; font-family: -apple-system, sans-serif; padding:0 20px; line-height:1.7; color:#1a1a1a; background:#fafafa; }
  code { background:#eee; padding:2px 6px; border-radius:4px; font-size:14px; }
  pre { background:#222; color:#0f0; padding:16px; border-radius:8px; overflow-x:auto; font-size:13px; line-height:1.6; }
  .price-box { background:#fff; border:2px solid #4caf50; border-radius:12px; padding:20px; margin:20px 0; }
  .price-box table { width:100%; border-collapse:collapse; }
  .price-box td, .price-box th { padding:8px; text-align:left; border-bottom:1px solid #eee; }
  h2 { color:#333; margin-top:30px; }
  .cta { background:#4caf50; color:white; padding:10px 24px; border-radius:6px; text-decoration:none; display:inline-block; margin:10px 0; }
</style>
</head>
<body>
<h1>🚀 DeepSeek Relay</h1>
<p>Cheapest AI API for devs. OpenAI compatible. Powered by DeepSeek V4.</p>

<div class="price-box">
<h3>💵 Pricing (per 1M tokens)</h3>
<table>
<tr><th></th><th>Our Price</th><th>Claude Opus</th><th>GPT-5.5</th></tr>
<tr><td>Input</td><td><strong>$${PRICE_IN}</strong></td><td>$5.00</td><td>$5.00</td></tr>
<tr><td>Output</td><td><strong>$${PRICE_OUT}</strong></td><td>$25.00</td><td>$30.00</td></tr>
</table>
<p style="font-size:14px;color:#888;">Save 95%+ vs US models. Same or better quality on most tasks.</p>
</div>

<h2>Quick Start</h2>
<pre>curl -X POST https://YOUR_DOMAIN/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</pre>

<p>Just change your <code>base_url</code> and <code>api_key</code> — your existing code works unchanged.</p>

<h2>Models</h2>
<ul>
<li><strong>deepseek-chat</strong> — Fast, general purpose (V4-Flash)</li>
<li><strong>deepseek-reasoner</strong> — Deep thinking (V4-Pro with R1 reasoning)</li>
</ul>

<h2>Endpoints</h2>
<ul>
<li><code>GET /v1/models</code></li>
<li><code>POST /v1/chat/completions</code></li>
<li><code>GET /v1/usage</code> — Check your usage</li>
<li><code>GET /pricing</code> — Pricing info</li>
<li><code>GET /health</code> — Service status</li>
</ul>

<p style="margin-top:40px;font-size:14px;color:#999;">
Contact: DM for API key · Server: Hong Kong · Latency: ~300ms to US West Coast
</p>
</body>
</html>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DeepSeek Relay running on http://0.0.0.0:${PORT}`);
  console.log(`Client keys: ${CLIENT_KEYS.size} configured`);
  console.log(`Pricing: $${PRICE_IN}/M in, $${PRICE_OUT}/M out`);
});

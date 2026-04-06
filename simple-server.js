#!/usr/bin/env node
// 超简版 - 稳定优先
const fs = require('fs');
const path = require('path');

const DATA = [
  { id: '1', title: 'OpenAI GPT-5 即将发布', platform: 'hackernews', url: 'https://news.ycombinator.com', opportunity_score: 89, tier: 'S', timestamp: new Date().toISOString() },
  { id: '2', title: 'Claude Code 在Reddit引发热议', platform: 'reddit', url: 'https://reddit.com', opportunity_score: 76, tier: 'A', timestamp: new Date().toISOString() },
  { id: '3', title: 'Tesla Optimus 机器人展示新灵巧性', platform: 'twitter', url: 'https://twitter.com', opportunity_score: 82, tier: 'A', timestamp: new Date().toISOString() },
  { id: '4', title: 'DeepSeek-V3 发布', platform: 'hackernews', url: 'https://news.ycombinator.com', opportunity_score: 92, tier: 'S', timestamp: new Date().toISOString() },
  { id: '5', title: 'AI代码助手年度总结', platform: 'reddit', url: 'https://reddit.com', opportunity_score: 71, tier: 'B', timestamp: new Date().toISOString() },
  { id: '6', title: '谷歌 Gemini 与 GPT-4 竞争', platform: 'twitter', url: 'https://twitter.com', opportunity_score: 78, tier: 'A', timestamp: new Date().toISOString() },
  { id: '7', title: 'YouTube: AI创业工具', platform: 'youtube', url: 'https://youtube.com', opportunity_score: 68, tier: 'B', timestamp: new Date().toISOString() },
  { id: '8', title: 'Meta 开源 Llama 3', platform: 'hackernews', url: 'https://news.ycombinator.com', opportunity_score: 90, tier: 'A', timestamp: new Date().toISOString() }
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function getHTML() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>🔥 跨境热点捕捉器</title><style>
body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:20px;margin:0}h1{color:#38bdf8;margin:0 0 20px 0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:20px}.card{background:#1e293b;border-radius:8px;padding:16px;border:1px solid #334155}.tier{padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:8px}.tier.S{background:#ef4444;color:white}.tier.A{background:#f97316;color:white}.tier.B{background:#eab308;color:black}.tier.C{background:#22c55e;color:white}.title{font-size:16px;font-weight:600;margin-bottom:8px}.title a{color:#e2e8f0;text-decoration:none}.score{font-size:24px;font-weight:bold;color:#38bdf8}.meta{color:#94a3b8;font-size:12px;margin-top:8px}
</style></head><body><div class="container"><h1>🔥 跨境热点捕捉器</h1><p>共 ${DATA.length} 条机会</p><div class="grid">
${DATA.map(o => `<div class="card"><span class="tier ${o.tier}">${o.tier}级</span><div class="title"><a href="${escapeHtml(o.url)}" target="_blank">${escapeHtml(o.title)}</a></div><div class="score">${o.opportunity_score}</div><div class="meta">平台: ${o.platform}</div></div>`).join('')}
</div></div></body></html>`;
}

module.exports = (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent']}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  try {
    const url = req.url || '/';
    console.log(`[DEBUG] Requested URL: "${url}"`);

    // 支持多种路径格式
    if (url === '/' || url === '/index.html' || url === '/index' || url === '/home') {
      console.log('[INFO] Serving HTML');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getHTML());
    } else if (url.startsWith('/api')) {
      console.log('[INFO] Serving API');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ opportunities: DATA, count: DATA.length }));
    } else {
      console.log('[WARN] 404 - URL not recognized:', url);
      // 对于任何未匹配的路径，返回HTML（避免404）
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getHTML());
    }
  } catch (err) {
    console.error('[ERROR]', err);
    res.writeHead(500);
    res.end('Server Error: ' + err.message);
  }
};
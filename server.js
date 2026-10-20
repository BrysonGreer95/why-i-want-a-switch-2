// Zero-dependency web server for "Why I Want a Switch 2".
// Built for Unkey Deploy: binds to $PORT (Unkey injects it, default 8080),
// shuts down cleanly on SIGTERM and never writes to disk.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 8080;
const PUBLIC_DIR = path.join(__dirname, "public");
const STARTED_AT = new Date();

const reasons = [
  { id: 1, title: "Mario Kart World", body: "I have been practicing my blue shell dodge in my head for months. It deserves a real track." },
  { id: 2, title: "Ship it, then play it", body: "Deploy on Friday, play on Friday night. The Switch 2 is the reward loop I need." },
  { id: 3, title: "Handheld on the go", body: "Flights, waiting rooms, conference hallways. A big screen that fits in my bag." },
  { id: 4, title: "Couch co-op", body: "Joy-Con 2 split between friends is the best low-latency multiplayer protocol ever invented." },
  { id: 5, title: "I built this app for it", body: "From empty repo to a live URL on Unkey. That has to count for something." },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(data, null, 2));
}

function serveStatic(req, res, pathname) {
  const file = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.normalize(path.join(PUBLIC_DIR, file));
  if (!resolved.startsWith(PUBLIC_DIR)) return sendJson(res, 400, { error: "bad path" });

  fs.readFile(resolved, (err, data) => {
    if (err) return sendJson(res, 404, { error: "not found" });
    res.writeHead(200, {
      "content-type": MIME[path.extname(resolved)] || "application/octet-stream",
      "cache-control": "public, max-age=300",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");

  if (req.method !== "GET" && req.method !== "HEAD") return sendJson(res, 405, { error: "method not allowed" });

  if (pathname === "/health" || pathname === "/api/health") {
    return sendJson(res, 200, { status: "ok", uptimeSeconds: Math.round(process.uptime()), startedAt: STARTED_AT });
  }
  if (pathname === "/api/reasons") return sendJson(res, 200, { count: reasons.length, reasons });
  if (pathname === "/api/reasons/random") return sendJson(res, 200, reasons[Math.floor(Math.random() * reasons.length)]);

  serveStatic(req, res, pathname);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`why-i-want-a-switch-2 listening on :${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

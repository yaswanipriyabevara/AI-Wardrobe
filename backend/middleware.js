const buckets = new Map();

function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key) || { start: now, count: 0 };
    if (now - bucket.start >= windowMs) { bucket.start = now; bucket.count = 0; }
    bucket.count += 1;
    buckets.set(key, bucket);
    if (bucket.count > max) return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    next();
  };
}

function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  if (res.headersSent) return next(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: status === 500 ? 'Something went wrong on the server.' : err.message });
}

module.exports = { rateLimit, errorHandler };

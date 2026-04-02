const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = process.env.PORT || 4000;
const redisUrl = process.env.REDIS_URL || 'redis://hero-redis:6379';
const client = createClient({ url: redisUrl });

client.on('error', (err) => {
  console.error('Redis client error', err);
});

async function initRedis() {
  try {
    await client.connect();
    console.log('hero-teklif connected to Redis', redisUrl);
    await client.hSet('hero-teklif:metadata', {
      app: 'hero-teklif',
      version: process.env.TEKLIF_VERSION || '1.0.0',
      startedAt: new Date().toISOString(),
    });
    await client.set('hero-teklif:status', 'ready');
  } catch (err) {
    console.error('Redis connection failed', err);
    process.exit(1);
  }
}

app.get('/health', async (req, res) => {
  try {
    const redisPing = await client.ping();
    const status = await client.get('hero-teklif:status');
    res.json({
      service: 'hero-teklif',
      status: status || 'unknown',
      redisPing,
      env: process.env.NODE_ENV || 'development',
    });
  } catch (err) {
    res.status(500).json({ service: 'hero-teklif', status: 'unhealthy', error: err.message });
  }
});

app.get('/contract', async (req, res) => {
  const metadata = await client.hGetAll('hero-teklif:metadata');
  res.json({
    service: 'hero-teklif',
    contract: {
      required: ['status', 'privacy', 'createdAt', 'updatedAt'],
      roles: ['leader', 'member', 'observer', 'parent', 'worker', 'student', 'athlete'],
    },
    metadata,
  });
});

initRedis().then(() => {
  app.listen(port, () => {
    console.log(`hero-teklif running on http://localhost:${port}`);
  });
});

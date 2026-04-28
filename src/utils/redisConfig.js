// utils/redisConfig.js
const buildRedisUrl = () => {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  const proto = process.env.REDIS_TLS === 'true' ? 'rediss' : 'redis';
  const user = encodeURIComponent(process.env.REDIS_USERNAME || 'default');
  const pass = encodeURIComponent(process.env.REDIS_PASSWORD || '');
  const host = process.env.REDIS_HOST || process.env.REDIS_SERVER || 'localhost';
  const port = process.env.REDIS_PORT || '6379';

  return `${proto}://${user}:${pass}@${host}:${port}`;
};

const createRedisConfig = () => {
  const url = buildRedisUrl();
  const tls = process.env.REDIS_TLS === 'true';
  return { url, socket: { tls } };
};

module.exports = { createRedisConfig };

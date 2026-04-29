/* eslint-disable no-console */
const { createClient } = require('redis');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');
const { createRedisConfig } = require('../../utils/redisConfig');

/** ----------------- Engines ----------------- * */
class RedisEngine {
  constructor() {
    const cfg = createRedisConfig();
    this._client = createClient(cfg);
    this._client.on('error', (err) => console.error('Redis error:', err));
    this._connected = false;
  }

  async _connect() {
    if (!this._connected || !this._client.isOpen) {
      await this._client.connect();
      this._connected = true;
    }
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._connect();
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    await this._client.set(key, payload, { EX: expirationInSecond });
  }

  async get(key) {
    await this._connect();
    const val = await this._client.get(key);
    if (val === null) throw new NotFoundError('Data not found');
    try {
      return JSON.parse(val);
    } catch (_) {
      return val;
    }
  }

  async delete(key) {
    await this._connect();
    await this._client.del(key);
  }

  async flush() {
    await this._connect();
    await this._client.flushAll();
  }
}

class PostgresEngine {
  constructor() {
    this._pool = createDatabasePool();
  }

  // SET/UPSERT: atomic tanpa race condition
  async set(key, value, expirationInSecond = 1800) {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    const q = {
      text: `
        INSERT INTO temp_data (key, value, _created_date, expired_in_second)
        VALUES ($1, $2, now(), $3)
        ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value,
              _created_date = EXCLUDED._created_date,
              expired_in_second = EXCLUDED.expired_in_second
      `,
      values: [key, payload, expirationInSecond],
    };
    const res = await this._pool.query(q);
    if (!res.rowCount) throw new InvariantError('failed to set data');
  }

  // GET: filter expiry di SQL (lebih hemat)
  async get(key) {
    const q = {
      text: `
        SELECT value
        FROM temp_data
        WHERE key = $1
          AND now() < _created_date + (expired_in_second || 0) * INTERVAL '1 second'
        LIMIT 1
      `,
      values: [key],
    };
    const r = await this._pool.query(q);
    if (!r.rowCount) throw new NotFoundError('Data not found');

    const v = r.rows[0].value;
    try {
      return JSON.parse(v);
    } catch (_) {
      return v;
    }
  }

  async delete(key) {
    await this._pool.query({ text: 'DELETE FROM temp_data WHERE key=$1', values: [key] });
  }

  async flush() {
    await this._pool.query('TRUNCATE temp_data');
  }
}

class NoopEngine {
  async set() {}

  async get() {
    throw new NotFoundError('Data not found');
  }

  async delete() {}

  async flush() {}
}

/** ----------------- Facade ----------------- * */
class CacheService {
  constructor() {
    const provider = (process.env.CACHE_PROVIDER || 'redis').toLowerCase();
    this._engine = provider === 'redis'
      ? new RedisEngine()
      : provider === 'db'
        ? new PostgresEngine()
        : new NoopEngine();

    console.log(`[Cache] provider = ${provider}`);
  }

  set(k, v, ttl) {
    return this._engine.set(k, v, ttl);
  }

  get(k) {
    return this._engine.get(k);
  }

  delete(k) {
    return this._engine.delete(k);
  }

  flush() {
    return this._engine.flush();
  }
}

module.exports = CacheService;

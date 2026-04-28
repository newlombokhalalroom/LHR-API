const { Pool } = require('pg');

const createDatabasePool = () => {
  let poolOptions = {};

  if (process.env.NODE_ENV === 'test') {
    return global.__MOCK_POOL__ || { query: async () => ({ rowCount: 0, rows: [] }) };
  }

  if (process.env.NODE_ENV === 'production') {
    poolOptions = {
      ssl: {
        rejectUnauthorized: false,
        sslmode: 'require',
      },
    };
  }

  return new Pool(poolOptions);
};

module.exports = { createDatabasePool };

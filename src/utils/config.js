const { Pool } = require('pg');

const createDatabasePool = () => {
  if (global.__MOCK_POOL__) {
    return global.__MOCK_POOL__;
  }

  let poolOptions = {};

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

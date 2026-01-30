const AuthStrategyConfig = {
  keys: process.env.ACCESS_TOKEN_KEY,
  verify: {
    aud: false,
    iss: false,
    sub: false,
    maxAgeSec: process.env.ACCESS_TOKEN_AGE,
  },
  validate: (artifacts) => ({
    isValid: true,
    credentials: {
      id: artifacts.decoded.payload.id,
      scope: artifacts.decoded.payload.scope,
    },
  }),
};

module.exports = AuthStrategyConfig;

const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MID_SERVER_KEY,
});

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MID_SERVER_KEY,
  clientKey: process.env.MID_CLIENT_KEY,
});

module.exports = { snap, apiClient };

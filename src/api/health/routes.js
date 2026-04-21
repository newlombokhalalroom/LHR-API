const routes = () => [
  {
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return h
        .response({
          status: 'success',
          message: 'Server is healthy!',
          timestamp: new Date().toISOString(),
        })
        .code(200);
    },
  },
];
module.exports = routes;

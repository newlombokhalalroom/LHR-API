const path = require('path');

const routes = () => [
  {
    method: 'GET',
    path: '/',
    handler: {
      file: path.resolve(__dirname, 'index.html'),
    },
  },
  {
    method: 'GET',
    path: '/guides/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'guides'),
      },
    },
  },
  {
    method: 'GET',
    path: '/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'images'),
      },
    },
  },
  {
    method: 'GET',
    path: '/{filename}',
    handler: async (request, h) => {
      const { filename } = request.params;
      if (!filename.endsWith('.md')) {
        return h
          .response({
            status: true,
            message: 'Not Found',
          })
          .code(404);
      }
      return h.file(path.resolve(__dirname, filename));
    },
  },
];

module.exports = routes;

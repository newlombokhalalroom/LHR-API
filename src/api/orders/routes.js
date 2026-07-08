const routes = (handler) => [
  {
    method: 'POST',
    path: '/orders/{clientId}',
    handler: handler.postOrdersHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'user',
      },
    },
  },
  // {
  //   method: 'DELETE',
  //   path: '/orders/{id}',
  //   handler: handler.deleteOrdersHandler,
  //   config: {
  //     auth: {
  //       strategy: 'lombokhalalroom_jwt',
  //       scope: 'user',
  //     },
  //   },
  // },
  {
    method: 'GET',
    path: '/orders',
    handler: handler.getUserOrdersHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/orders/{id}',
    handler: handler.getUserOrderByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/orders/{id}/invoice',
    handler: handler.getUserInvoiceByOrderIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin'],
      },
    },
  },
  // for testing midtrans request
  {
    method: 'GET',
    path: '/orders/{id}/payment',
    handler: handler.getMidSnapTokenHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user'],
      },
    },
  },
  {
    method: 'POST',
    path: '/orders/notification',
    handler: handler.midtransNotificationHandler,
  },
  {
    method: 'PUT',
    path: '/orders/{id}/confirmation/{status}',
    handler: handler.putOrderConfirmationStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['admin'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/orders/{id}/sandbox-confirm',
    handler: handler.sandboxPaymentConfirmHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/orders/{id}/cancel',
    handler: handler.cancelUnpaidOrderHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/orders/{id}/completed',
    handler: handler.putOrderCompletedStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user'],
      },
    },
  },
  {
    method: 'GET',
    path: '/orders/summaries',
    handler: handler.getUserOrdersSummaryHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['admin'],
      },
    },
  },
  {
    method: 'POST',
    path: '/orders/{orderId}/reviews/{productId}',
    handler: handler.postProductReviewHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user'],
      },
    },
  },
  {
    method: 'GET',
    path: '/super-admin/orders',
    handler: handler.getAllOrdersHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Get all orders with pagination',
      tags: ['api', 'super-admin', 'orders'],
    },
  },
  {
    method: 'PUT',
    path: '/super-admin/orders/{id}',
    handler: handler.putOrderHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Update an order (partial update supported)',
      tags: ['api', 'super-admin', 'orders'],
    },
  },
  {
    method: 'DELETE',
    path: '/super-admin/orders/{id}',
    handler: handler.deleteOrderHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Delete an order by ID',
      tags: ['api', 'super-admin', 'orders'],
    },
  },
  {
    method: 'GET',
    path: '/super-admin/orders/{id}',
    handler: handler.getSuperAdminOrderByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Get order detail by ID (super-admin)',
      tags: ['api', 'super-admin', 'orders'],
    },
  },
  {
    method: 'GET',
    path: '/orders/test-cache',
    handler: handler.testCacheHandler,
  },
];

module.exports = routes;

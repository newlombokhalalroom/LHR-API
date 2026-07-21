const routes = (handler) => [
  {
    // US-09 Melakukan Pembayaran Online - eksekusi pesanan kedalam database ketika pesanan sudah dibayar
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
    // US-10 Melihat invoice pembayaran - pemanggilan handler
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
  // US-09 Melakukan Pembayaran – Panggil Midtrans
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
    // US-11 Memvalidasi Pesanan Masuk & US-12 Memperbarui Status Pesanan - Pemanggilan API Konfirmasi Pesanan diterima atau ditolak
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
    // US-12 Memperbarui Status Pesanan - Pemanggilan API Konfirmasi Pesananselesai
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
    // US-14 Melihat Laporan Transaksi (Dashboard)
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
    // US-13 Memberikan Ulasan & Rating - pemanggilan API review/ulasan
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

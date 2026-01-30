exports.up = (pgm) => {
  pgm.createType('orders_status', ['unpaid', 'process', 'progress', 'done', 'cancelled']);
  pgm.addColumn('orders', {
    status: {
      type: 'orders_status',
      notNull: true,
      default: 'process',
    },
    total: {
      type: 'numeric (15, 2)',
      notNull: true,
      default: '0',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('orders', 'total');
  pgm.dropColumn('orders', 'status');
  pgm.dropType('orders_status');
};

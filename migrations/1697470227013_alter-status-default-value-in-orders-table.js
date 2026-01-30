exports.up = (pgm) => {
  pgm.alterColumn('orders', 'status', {
    default: 'unpaid',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('orders', 'status', {
    default: 'process',
  });
};

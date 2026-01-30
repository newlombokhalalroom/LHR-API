exports.up = (pgm) => {
  pgm.dropColumn('products', 'quantity');
};

exports.down = (pgm) => {
  pgm.addColumn('products', {
    quantity: {
      type: 'integer',
      check: 'quantity >= 0',
    },
  });
};

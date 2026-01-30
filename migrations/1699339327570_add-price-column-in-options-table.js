exports.up = (pgm) => {
  pgm.addColumn('options', {
    price: {
      type: 'numeric',
      notNull: true,
      check: 'price >= 0',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('options', 'price');
};

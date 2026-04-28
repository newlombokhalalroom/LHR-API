exports.up = (pgm) => {
  pgm.renameColumn('products', 'availablility', 'availability');
};

exports.down = (pgm) => {
  pgm.renameColumn('products', 'availability', 'availablility');
};

exports.up = (pgm) => {
  pgm.addConstraint('products_options', 'unique_option_id_and_product_id', 'UNIQUE(option_id, product_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('products_options', 'unique_option_id_and_product_id');
};

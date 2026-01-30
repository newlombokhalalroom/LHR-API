exports.up = (pgm) => {
  pgm.addConstraint('product_details', 'unique_detail_id_and_product_id', 'UNIQUE(detail_id, product_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_details', 'unique_detail_id_and_product_id');
};

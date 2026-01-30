exports.up = (pgm) => {
  pgm.addConstraint('product_amenities', 'unique_amenity_id_and_product_id', 'UNIQUE(amenity_id, product_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_amenities', 'unique_amenity_id_and_product_id');
};

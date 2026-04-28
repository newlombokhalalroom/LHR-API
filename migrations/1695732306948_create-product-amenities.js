exports.up = (pgm) => {
  pgm.createTable('product_amenities', {
    amenity_id: {
      type: 'uuid',
      notNull: true,
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('product_amenities', 'fk_product_amenities.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.addConstraint('product_amenities', 'fk_product_amenities.amenity_id_amenities.id', 'FOREIGN KEY(amenity_id) REFERENCES amenities(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_amenities', 'fk_product_amenities.product_id_products.id');
  pgm.dropConstraint('product_amenities', 'fk_product_amenities.amenity_id_amenities.id');
  pgm.dropTable('product_amenities');
};

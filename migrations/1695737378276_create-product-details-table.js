exports.up = (pgm) => {
  pgm.createTable('product_details', {
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    detail_id: {
      type: 'uuid',
      notNull: true,
    },
    amount: {
      type: 'numeric',
      default: 1,
      check: 'amount >= 0',
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    _updated_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('product_details', 'fk_product_details.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.addConstraint('product_details', 'fk_product_details.detail_id_details.id', 'FOREIGN KEY(detail_id) REFERENCES details(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_details', 'fk_product_details.product_id_products.id');
  pgm.dropConstraint('product_details', 'fk_product_details.detail_id_details.id');
  pgm.dropTable('product_details');
};

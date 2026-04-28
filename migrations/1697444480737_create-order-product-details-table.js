exports.up = (pgm) => {
  pgm.createTable('order_product_details', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    title: {
      type: 'varchar(100)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    price: {
      type: 'numeric',
      notNull: true,
      check: 'price >= 0',
    },
    units: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('order_product_details', 'fk_order_product_details.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE NO ACTION');
};

exports.down = (pgm) => {
  pgm.dropConstraint('order_product_details', 'fk_order_product_details.product_id_products.id');
  pgm.dropTable('order_product_details');
};

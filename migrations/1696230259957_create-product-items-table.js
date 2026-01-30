exports.up = (pgm) => {
  pgm.createTable('product_items', {
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
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    _updated_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('product_items', 'fk_product_items.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_items', 'fk_product_items.product_id_products.id');
  pgm.dropTable('product_items');
};

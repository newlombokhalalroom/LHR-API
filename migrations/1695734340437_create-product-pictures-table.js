exports.up = (pgm) => {
  pgm.createTable('product_pictures', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    picture: {
      type: 'TEXT',
      notNull: true,
    },
    title: {
      type: 'VARCHAR(100)',
    },
    description: {
      type: 'TEXT',
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
  pgm.addConstraint('product_pictures', 'fk_product_pictures.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('product_pictures', 'fk_product_pictures.product_id_products.id');
  pgm.dropTable('product_pictures');
};

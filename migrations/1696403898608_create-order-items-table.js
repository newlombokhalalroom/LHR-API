exports.up = (pgm) => {
  pgm.createTable('order_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    order_id: {
      type: 'uuid',
      notNull: true,
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    quantity: {
      type: 'integer',
      notNull: true,
      check: 'quantity > 0',
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
  pgm.addConstraint('order_items', 'fk_order_items.order_id_orders.id', 'FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE');
  pgm.addConstraint('order_items', 'fk_order_items.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('order_items', 'fk_order_items.product_id_products.id');
  pgm.dropConstraint('order_items', 'fk_order_items.order_id_orders.id');
  pgm.dropTable('order_items');
};

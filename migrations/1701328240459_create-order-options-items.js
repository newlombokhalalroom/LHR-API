exports.up = (pgm) => {
  pgm.createTable('order_options_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    order_items_id: {
      type: 'uuid',

    },
    option_id: {
      type: 'uuid',
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    price: {
      type: 'numeric',
      notNull: true,
      check: 'price >= 0',
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('order_options_items', 'fk_order_options_items.order_options_items_order_items.id', 'FOREIGN KEY(order_items_id) REFERENCES order_items(id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('order_options_items', 'fk_order_options_items.order_options_items_order_items.id');
  pgm.dropTable('order_options_items');
};

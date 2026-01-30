exports.up = (pgm) => {
  pgm.createTable('reviews', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    order_id: {
      type: 'uuid',
      notNull: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    review_content: {
      type: 'TEXT',
      notNull: true,
    },
    review_rate: {
      type: 'numeric',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('reviews', 'fk_reviews.order_id_orders.id', 'FOREIGN KEY(order_id) REFERENCES orders(id)');
  pgm.addConstraint('reviews', 'fk_reviews.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id)');
  pgm.addConstraint('reviews', 'fk_reviews.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('reviews', 'fk_reviews.order_id_orders.id');
  pgm.dropConstraint('reviews', 'fk_reviews.user_id_users.id');
  pgm.dropConstraint('reviews', 'fk_reviews.product_id_products.id');
  pgm.dropTable('reviews');
};

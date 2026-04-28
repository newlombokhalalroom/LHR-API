exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
    },
    client_id: {
      type: 'uuid',
      notNull: true,
    },
    start_date: {
      type: 'timestamptz',
      notNull: true,
    },
    end_date: {
      type: 'timestamptz',
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
  pgm.addConstraint('orders', 'fk_orders.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('orders', 'fk_orders.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('orders', 'fk_orders.client_id_clients.id');
  pgm.dropConstraint('orders', 'fk_orders.user_id_users.id');
  pgm.dropTable('orders');
};

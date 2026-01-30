exports.up = (pgm) => {
  pgm.createTable('balances', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    client_id: {
      type: 'uuid',
      unique: true,
      notNull: true,
    },
    amount: {
      type: 'numeric (15, 2)',
      notNull: true,
      default: '0',
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
  pgm.addConstraint('balances', 'fk_balances.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('balances', 'fk_balances.client_id_clients.id');
  pgm.dropTable('balances');
};

exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    client_id: {
      type: 'uuid',
      notNull: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    availablility: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
    quantity: {
      type: 'integer',
      check: 'quantity >= 0',
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
    _updated_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('products', 'fk_products.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('products', 'fk_products.client_id_clients.id');
  pgm.dropTable('products');
};

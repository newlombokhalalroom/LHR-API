exports.up = (pgm) => {
  pgm.createTable('client_details', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    client_id: {
      type: 'uuid',
      notNull: true,
    },
    name: {
      type: 'varchar(100)',
      notNull: true,
    },
    email: {
      type: 'varchar(100)',
      notNull: true,
    },
    phone: {
      type: 'varchar(50)',
      notNull: true,
    },
    npwp: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('client_details', 'fk_client_details.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE NO ACTION');
};

exports.down = (pgm) => {
  pgm.dropConstraint('client_details', 'fk_client_details.client_id_clients.id');
  pgm.dropTable('client_details');
};

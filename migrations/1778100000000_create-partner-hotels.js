exports.up = (pgm) => {
  pgm.createTable('partner_hotels', {
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
      type: 'VARCHAR(255)',
      notNull: true,
    },
    price_per_night: {
      type: 'INT',
      notNull: true,
      default: 0,
    },
    address: {
      type: 'TEXT',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    _created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    _updated_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('partner_hotels', 'fk_client', {
    foreignKeys: {
      columns: 'client_id',
      references: 'clients(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('partner_hotels');
};

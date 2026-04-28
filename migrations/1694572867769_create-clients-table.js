exports.up = (pgm) => {
  pgm.createTable('clients', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    type_id: {
      type: 'uuid',
      notNull: true,
    },
    owner_id: {
      type: 'uuid',
      notNull: true,
    },
    approved_by: {
      type: 'uuid',
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    email: {
      type: 'VARCHAR(100)',
    },
    phone: {
      type: 'VARCHAR(50)',
    },
    npwp: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    picture: {
      type: 'TEXT',
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
};

exports.down = (pgm) => {
  pgm.dropTable('clients');
};

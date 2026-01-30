exports.up = (pgm) => {
  pgm.createTable('client_pictures', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    client_id: {
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
};

exports.down = (pgm) => {
  pgm.dropTable('client_pictures');
};

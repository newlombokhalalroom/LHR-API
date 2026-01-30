exports.up = (pgm) => {
  pgm.createTable('destinations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    address: {
      type: 'TEXT',
      notNull: true,
    },
    coordinate: {
      type: 'GEOGRAPHY(Point)',
      notNull: true,
    },
    city: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    province: {
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
};

exports.down = (pgm) => {
  pgm.dropTable('destinations');
};

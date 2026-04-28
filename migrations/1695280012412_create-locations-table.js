exports.up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis;');

  pgm.createTable('locations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    client_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
    },
    address: {
      type: 'TEXT',
    },
    coordinate: {
      type: 'GEOGRAPHY(Point)',
    },
    city: {
      type: 'VARCHAR(100)',
    },
    province: {
      type: 'VARCHAR(100)',
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
  pgm.dropTable('locations');
};

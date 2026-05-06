/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('trip_details', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: '"products"',
      onDelete: 'CASCADE',
    },
    trip_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    _created_date: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    _updated_date: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.createTable('itineraries', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: '"products"',
      onDelete: 'CASCADE',
    },
    day: {
      type: 'integer',
      notNull: true,
    },
    time: {
      type: 'varchar(50)',
      notNull: true,
    },
    activity: {
      type: 'varchar(100)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    _created_date: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    _updated_date: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('itineraries');
  pgm.dropTable('trip_details');
};

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('advertisements', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    image: {
      type: 'text',
    },
    type: {
      type: 'varchar(50)',
      notNull: true,
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'inactive',
    },
    start_date: {
      type: 'timestamp',
      notNull: true,
    },
    end_date: {
      type: 'timestamp',
      notNull: true,
    },
    link_target: {
      type: 'text',
    },
    priority: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('advertisements');
};

exports.up = (pgm) => {
  pgm.createTable('options', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    type_id: {
      type: 'uuid',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    title: {
      type: 'VARCHAR(100)',
      unique: true,
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
  pgm.addConstraint('options', 'fk_options.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('options', 'fk_options.type_id_types.id');
  pgm.dropTable('options');
};

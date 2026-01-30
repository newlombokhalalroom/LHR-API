exports.up = (pgm) => {
  pgm.createType('facility_category', ['halal', 'regular']);
  pgm.createTable('facilities', {
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
      type: 'facility_category',
      default: 'regular',
    },
    title: {
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
  pgm.dropTable('facilities');
  pgm.dropType('facility_category');
};

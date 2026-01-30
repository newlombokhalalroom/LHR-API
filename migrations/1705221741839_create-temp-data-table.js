exports.up = (pgm) => {
  pgm.createTable('temp_data', {
    key: {
      type: 'TEXT',
      primaryKey: true,
    },
    value: {
      type: 'TEXT',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    expired_in_second: {
      type: 'numeric',
    },
  });
};
exports.down = (pgm) => {
  pgm.dropTable('temp_data');
};

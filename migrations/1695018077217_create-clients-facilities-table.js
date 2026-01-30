exports.up = (pgm) => {
  pgm.createTable('clients_facilities', {
    facility_id: {
      type: 'uuid',
      notNull: true,
    },
    client_id: {
      type: 'uuid',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('clients_facilities');
};

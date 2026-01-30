exports.up = (pgm) => {
  pgm.alterColumn('unavailable_status', 'start_date', {
    type: 'timestamptz',
    notNull: true,
  });
  pgm.alterColumn('unavailable_status', 'end_date', {
    type: 'timestamptz',
    notNull: true,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('unavailable_status', 'start_date', {
    type: 'date',
    notNull: true,
  });
  pgm.alterColumn('unavailable_status', 'end_date', {
    type: 'date',
    notNull: true,
  });
};

exports.up = (pgm) => {
  pgm.alterColumn('contacts', 'user_id', { notNull: true });
  pgm.alterColumn('contacts', 'first_name', { notNull: false });
  pgm.alterColumn('contacts', 'last_name', { notNull: false });
  pgm.alterColumn('contacts', 'email', { notNull: false });
  pgm.alterColumn('contacts', 'phone', { notNull: false });
};

exports.down = (pgm) => {
  pgm.alterColumn('contacts', 'user_id', { notNull: false });
  pgm.alterColumn('contacts', 'first_name', { notNull: true });
  pgm.alterColumn('contacts', 'last_name', { notNull: true });
  pgm.alterColumn('contacts', 'email', { notNull: true });
  pgm.alterColumn('contacts', 'phone', { notNull: true });
};

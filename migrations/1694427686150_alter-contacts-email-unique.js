exports.up = (pgm) => {
  pgm.alterColumn('contacts', 'email', { unique: true });
};

exports.down = (pgm) => {
  pgm.alterColumn('contacts', 'email', { unique: false });
};

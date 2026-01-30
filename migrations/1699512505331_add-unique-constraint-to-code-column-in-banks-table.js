exports.up = (pgm) => {
  pgm.addConstraint('banks', 'unique_banks_code', 'UNIQUE(code)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('banks', 'unique_banks_code');
};

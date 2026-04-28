exports.up = (pgm) => {
  pgm.dropConstraint('options', 'options_title_key');
  pgm.addConstraint('options', 'unique_options_title_and_category', 'UNIQUE(title, category)');
};
exports.down = (pgm) => {
  pgm.dropConstraint('options', 'unique_options_title_and_category');
  pgm.addConstraint('options', 'options_title_key', 'UNIQUE(title)');
};

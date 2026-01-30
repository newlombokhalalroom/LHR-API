exports.up = (pgm) => {
  pgm.addConstraint('detail_categories', 'unique_title', 'UNIQUE(title)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('detail_categories', 'unique_title', 'UNIQUE(title)');
};

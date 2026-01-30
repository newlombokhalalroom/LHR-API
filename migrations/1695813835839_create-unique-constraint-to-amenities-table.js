exports.up = (pgm) => {
  pgm.addConstraint('amenities', 'unique_amenities_title', 'UNIQUE(title)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('amenities', 'unique_amenities_title');
};

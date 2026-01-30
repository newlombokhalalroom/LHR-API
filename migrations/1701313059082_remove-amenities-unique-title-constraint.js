exports.up = (pgm) => {
  pgm.dropConstraint('amenities', 'unique_amenities_title');
  pgm.addConstraint('amenities', 'unique_amenities_title_and_category', 'UNIQUE(title, category)');
};
exports.down = (pgm) => {
  pgm.dropConstraint('amenities', 'unique_amenities_title_and_category');
  pgm.addConstraint('amenities', 'unique_amenities_title', 'UNIQUE(title)');
};

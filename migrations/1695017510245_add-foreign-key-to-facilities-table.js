exports.up = (pgm) => {
  pgm.addConstraint('facilities', 'fk_facilities.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('facilities', 'fk_facilities.type_id_types.id');
};

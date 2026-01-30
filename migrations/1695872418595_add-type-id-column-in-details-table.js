exports.up = (pgm) => {
  pgm.addColumn('details', {
    type_id: {
      type: 'uuid',
      notNull: true,
    },
  });

  pgm.addConstraint('details', 'fk_details.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('details', 'fk_details.type_id_types.id');
  pgm.dropColumn('details', 'type_id');
};

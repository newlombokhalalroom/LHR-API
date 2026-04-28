exports.up = (pgm) => {
  pgm.addConstraint('clients', 'fk_clients.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('clients', 'fk_clients.type_id_types.id');
};

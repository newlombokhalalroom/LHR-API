exports.up = (pgm) => {
  pgm.addConstraint('locations', 'fk_locations.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('locations', 'fk_locations.client_id_clients.id');
};

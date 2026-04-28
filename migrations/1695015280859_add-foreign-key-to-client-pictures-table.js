exports.up = (pgm) => {
  pgm.addConstraint('client_pictures', 'fk_client_pictures.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('client_pictures', 'fk_client_pictures.client_id_clients.id');
};

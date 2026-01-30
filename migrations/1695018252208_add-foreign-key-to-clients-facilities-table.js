exports.up = (pgm) => {
  pgm.addConstraint('clients_facilities', 'fk_clients_facilities.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
  pgm.addConstraint('clients_facilities', 'fk_clients_facilities.facility_id_facilities.id', 'FOREIGN KEY(facility_id) REFERENCES facilities(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('clients_facilities', 'fk_clients_facilities.client_id_clients.id');
  pgm.dropConstraint('clients_facilities', 'fk_clients_facilities.facility_id_facilities.id');
};

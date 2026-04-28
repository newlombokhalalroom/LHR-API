exports.up = (pgm) => {
  pgm.addConstraint('clients_facilities', 'unique_facility_id_and_client_id', 'UNIQUE(facility_id, client_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('clients_facilities', 'unique_facility_id_and_client_id');
};

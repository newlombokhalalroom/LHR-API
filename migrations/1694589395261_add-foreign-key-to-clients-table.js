exports.up = (pgm) => {
  pgm.addConstraint('clients', 'fk_clients.owner_id_users.id', 'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('clients', 'fk_clients.approved_by_users.id', 'FOREIGN KEY(approved_by) REFERENCES users(id) ON DELETE SET NULL');
};

exports.down = (pgm) => {
  pgm.dropConstraint('clients', 'fk_clients.owner_id_users.id');
  pgm.dropConstraint('clients', 'fk_clients.approved_by_users.id');
};

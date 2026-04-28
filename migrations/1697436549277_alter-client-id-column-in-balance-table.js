exports.up = (pgm) => {
  pgm.dropConstraint('balances', 'fk_balances.client_id_clients.id');

  pgm.renameColumn('balances', 'client_id', 'user_id');

  pgm.addConstraint('balances', 'fk_balances.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('balances', 'fk_balances.user_id_users.id');

  pgm.renameColumn('balances', 'user_id', 'client_id');

  pgm.addConstraint('balances', 'fk_balances.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

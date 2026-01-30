exports.up = (pgm) => {
  pgm.dropConstraint('orders', 'fk_orders.user_id_users.id');
  pgm.dropConstraint('orders', 'fk_orders.client_id_clients.id');
  pgm.renameColumn('orders', 'user_id', 'user_details_id');
  pgm.renameColumn('orders', 'client_id', 'client_details_id');
};

exports.down = (pgm) => {
  pgm.renameColumn('orders', 'client_details_id', 'client_id');
  pgm.renameColumn('orders', 'user_details_id', 'user_id');
  pgm.addConstraint('orders', 'fk_orders.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('orders', 'fk_orders.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
};

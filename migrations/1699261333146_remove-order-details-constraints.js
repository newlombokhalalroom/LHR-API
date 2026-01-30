exports.up = (pgm) => {
  pgm.dropConstraint('user_details', 'fk_user_details.user_id_users.id');
  pgm.dropConstraint('client_details', 'fk_client_details.client_id_clients.id');
  pgm.dropConstraint('order_product_details', 'fk_order_product_details.product_id_products.id');
};

exports.down = (pgm) => {
  pgm.addConstraint('user_details', 'fk_user_details.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE NO ACTION');
  pgm.addConstraint('client_details', 'fk_client_details.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE NO ACTION');
  pgm.addConstraint('order_product_details', 'fk_order_product_details.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE NO ACTION');
};

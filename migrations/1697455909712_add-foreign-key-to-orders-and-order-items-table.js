exports.up = (pgm) => {
  pgm.addConstraint('orders', 'fk_orders.user_details_id_user_details.id', 'FOREIGN KEY(user_details_id) REFERENCES user_details(id) ON DELETE NO ACTION');
  pgm.addConstraint('orders', 'fk_orders.client_details_id_client_details.id', 'FOREIGN KEY(client_details_id) REFERENCES client_details(id) ON DELETE NO ACTION');
  pgm.addConstraint('order_items', 'fk_order_items.order_product_details_id_order_product_details.id', 'FOREIGN KEY(order_product_details_id) REFERENCES order_product_details(id) ON DELETE NO ACTION');
};

exports.down = (pgm) => {
  pgm.dropConstraint('order_items', 'fk_order_items.order_product_details_id_order_product_details.id');
  pgm.dropConstraint('orders', 'fk_orders.client_details_id_client_details.id');
  pgm.dropConstraint('orders', 'fk_orders.user_details_id_user_details.id');
};

exports.up = (pgm) => {
  pgm.addColumn('order_items', {
    total: {
      type: 'numeric (15, 2)',
      notNull: true,
      default: '0',
    },
  });
  pgm.dropConstraint('order_items', 'fk_order_items.product_id_products.id');
  pgm.renameColumn('order_items', 'product_id', 'order_product_details_id');
};

exports.down = (pgm) => {
  pgm.renameColumn('order_items', 'order_product_details_id', 'product_id');
  pgm.addConstraint('order_items', 'fk_order_items.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.dropColumn('order_items', 'total');
};

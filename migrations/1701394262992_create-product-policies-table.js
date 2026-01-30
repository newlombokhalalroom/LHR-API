exports.up = (pgm) => {
  pgm.createTable('products_policies', {
    policy_id: {
      type: 'uuid',
      notNull: true,
    },
    product_id: {
      type: 'uuid',
      notNull: true,
    },
    details: {
      type: 'text',
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    _updated_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('products_policies', 'unique_policy_id_and_product_id', 'UNIQUE(policy_id, product_id)');
  pgm.addConstraint('products_policies', 'fk_products_policies.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.addConstraint('products_policies', 'fk_products_policies.policy_id_policies.id', 'FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('products_policies', 'fk_products_policies.policy_id_policies.id');
  pgm.dropConstraint('products_policies', 'fk_products_policies.product_id_products.id');
  pgm.dropConstraint('products_policies', 'unique_policy_id_and_product_id');
  pgm.dropTable('products_policies');
};

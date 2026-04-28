exports.up = (pgm) => {
  pgm.createTable('clients_policies', {
    policy_id: {
      type: 'uuid',
      notNull: true,
    },
    client_id: {
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
  pgm.addConstraint('clients_policies', 'unique_policy_id_and_client_id', 'UNIQUE(policy_id, client_id)');
  pgm.addConstraint('clients_policies', 'fk_clients_policies.client_id_clients.id', 'FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE');
  pgm.addConstraint('clients_policies', 'fk_clients_policies.policy_id_policies.id', 'FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('clients_policies', 'fk_clients_policies.policy_id_policies.id');
  pgm.dropConstraint('clients_policies', 'fk_clients_policies.client_id_clients.id');
  pgm.dropConstraint('clients_policies', 'unique_policy_id_and_client_id');
  pgm.dropTable('clients_policies');
};

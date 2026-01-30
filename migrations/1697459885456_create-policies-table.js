exports.up = (pgm) => {
  pgm.createType('policy_category', ['halal', 'regular']);
  pgm.createTable('policies', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    type_id: {
      type: 'uuid',
      notNull: true,
    },
    category: {
      type: 'policy_category',
      default: 'regular',
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
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
  pgm.addConstraint('policies', 'fk_policies.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('policies', 'fk_policies.type_id_types.id');
  pgm.dropTable('policies');
  pgm.dropType('policy_category');
};

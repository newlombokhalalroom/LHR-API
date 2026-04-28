exports.up = (pgm) => {
  pgm.createTable('cards', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    bank_id: {
      type: 'uuid',
      notNull: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
    },
    card_number: {
      type: 'VARCHAR(16)',
      notNull: true,
    },
    card_holder: {
      type: 'VARCHAR(100)',
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
  pgm.addConstraint('cards', 'fk_cards.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('cards', 'fk_cards.user_id_users.id');
  pgm.dropTable('cards');
};

exports.up = (pgm) => {
  pgm.createType('withdrawal_status', ['pending', 'process', 'cancelled', 'success']);
  pgm.createTable('withdrawals', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    card_id: {
      type: 'uuid',
      notNull: true,
    },
    balance_id: {
      type: 'uuid',
      notNull: true,
    },
    amount: {
      type: 'numeric (15, 2)',
      notNull: true,
      default: '0',
    },
    status: {
      type: 'withdrawal_status',
      notNull: true,
      default: 'pending',
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
  pgm.addConstraint(
    'withdrawals',
    'fk_withdrawals.card_id_cards.id',
    'FOREIGN KEY(card_id) REFERENCES cards(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'withdrawals',
    'fk_withdrawals.balance_id_balances.id',
    'FOREIGN KEY(balance_id) REFERENCES balances(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('withdrawals', 'fk_withdrawals.balance_id_balances.id');
  pgm.dropConstraint('withdrawals', 'fk_withdrawals.card_id_cards.id');
  pgm.dropTable('withdrawals');
  pgm.dropType('withdrawal_status');
};

exports.up = (pgm) => {
  pgm.createTable('banks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    code: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    title: {
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
  pgm.addConstraint('cards', 'fk_cards.bank_id_banks.id', 'FOREIGN KEY(bank_id) REFERENCES banks(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('cards', 'fk_cards.bank_id_banks.id');
  pgm.dropTable('banks');
};

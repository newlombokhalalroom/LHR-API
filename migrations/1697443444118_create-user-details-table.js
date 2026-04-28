exports.up = (pgm) => {
  pgm.createTable('user_details', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
    },
    first_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    last_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    email: {
      type: 'varchar(100)',
      notNull: true,
    },
    phone: {
      type: 'varchar(50)',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('user_details', 'fk_user_details.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE NO ACTION');
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_details', 'fk_user_details.user_id_users.id');
  pgm.dropTable('user_details');
};

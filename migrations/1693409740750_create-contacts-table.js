exports.up = (pgm) => {
  pgm.createTable('contacts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      unique: true,
      notNull: false,
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
    _is_email_verified: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    _is_phone_verified: {
      type: 'boolean',
      notNull: true,
      default: false,
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
};

exports.down = (pgm) => {
  pgm.dropTable('contacts');
};

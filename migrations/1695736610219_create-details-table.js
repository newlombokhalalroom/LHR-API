exports.up = (pgm) => {
  pgm.createTable('details', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    category_id: {
      type: 'uuid',
      notNull: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true,
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
  pgm.addConstraint('details', 'fk_details.category_id_detail_categories.id', 'FOREIGN KEY(category_id) REFERENCES detail_categories(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('details', 'fk_details.category_id_detail_categories.id');
  pgm.dropTable('details');
};

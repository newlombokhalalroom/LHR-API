exports.up = (pgm) => {
  pgm.createTable('unavailable_status', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    item_id: {
      type: 'uuid',
      notNull: true,
    },
    start_date: {
      type: 'date',
      notNull: true,
    },
    end_date: {
      type: 'date',
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
  pgm.addConstraint('unavailable_status', 'fk_unavailable_status.item_id_product_items.id', 'FOREIGN KEY(item_id) REFERENCES product_items(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('unavailable_status', 'fk_unavailable_status.item_id_product_items.id');
  pgm.dropTable('unavailable_status');
};

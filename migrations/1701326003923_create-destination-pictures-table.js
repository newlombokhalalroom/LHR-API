exports.up = (pgm) => {
  pgm.createTable('destination_pictures', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    destination_id: {
      type: 'uuid',
      notNull: true,
    },
    picture: {
      type: 'TEXT',
      notNull: true,
    },
    _created_date: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('destination_pictures', 'fk_destination_pictures.destination_id_products.id', 'FOREIGN KEY(destination_id) REFERENCES destinations(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('destination_pictures', 'fk_destination_pictures.destination_id_products.id');
  pgm.dropTable('destination_pictures');
};

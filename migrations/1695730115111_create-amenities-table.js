exports.up = (pgm) => {
  pgm.createType('amenity_category', ['halal', 'regular']);
  pgm.createTable('amenities', {
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
      type: 'amenity_category',
      default: 'regular',
    },
    title: {
      type: 'VARCHAR(100)',
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
  pgm.addConstraint('amenities', 'fk_amenities.type_id_types.id', 'FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('amenities', 'fk_amenities.type_id_types.id');
  pgm.dropTable('amenities');
  pgm.dropType('amenity_category');
};

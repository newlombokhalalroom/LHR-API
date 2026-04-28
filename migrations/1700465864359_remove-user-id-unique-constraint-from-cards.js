exports.up = (pgm) => {
  pgm.dropConstraint('cards', 'cards_user_id_key');
};

exports.down = (pgm) => {
  pgm.addConstraint('cards', 'cards_user_id_key', {
    unique: ['user_id'],
  });
};

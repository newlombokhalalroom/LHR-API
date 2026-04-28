exports.up = (pgm) => {
  pgm.addColumn('banks', {
    icon: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('banks', 'icon');
};

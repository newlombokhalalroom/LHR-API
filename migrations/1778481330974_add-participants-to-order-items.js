exports.up = (pgm) => {
  pgm.addColumn('order_items', {
    participants: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('order_items', 'participants');
};

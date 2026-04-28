exports.up = (pgm) => {
  pgm.addColumn('users', {
    provider: {
      type: 'TEXT',
    },
    providerId: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'provider');
  pgm.dropColumn('users', 'providerId');
};

exports.up = (pgm) => {
  pgm.addColumn('users', {
    role_id: {
      type: 'uuid',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'role_id');
};

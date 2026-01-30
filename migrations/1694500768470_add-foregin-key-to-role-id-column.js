exports.up = (pgm) => {
  pgm.addConstraint('users', 'fk_users.role_id_roles.id', 'FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('users', 'fk_users.role_id_roles.id');
};

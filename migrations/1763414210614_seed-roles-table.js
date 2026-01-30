exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO roles (title, description)
    VALUES
      ('user', 'Default role untuk user biasa'),
      ('admin', 'Role untuk admin/mitra'),
      ('super-admin', 'Role untuk super administrator')
    ON CONFLICT (title) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM roles
    WHERE title IN ('user', 'admin', 'super-admin');
  `);
};

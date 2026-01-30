exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO advertisements (
      id, title, description, image, type, status, start_date, end_date, link_target, priority, created_at, updated_at
    ) VALUES (
      'c01f8245-fa3d-49c7-9854-4b4909f965c2',
      'Promo Ramadan Diskon 50%',
      'Nikmati diskon menginap hingga 50% selama bulan Ramadan',
      'https://example.com/uploads/banner-ramadan.jpg',
      'top',
      'active',
      '2025-03-10 00:00:00+08',
      '2025-04-30 00:00:00+08',
      'https://lombokhalalroom.com/promo/ramadan',
      1,
      '2025-05-23 07:27:51.114001+08',
      '2025-05-23 07:27:51.114001+08'
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM advertisements
    WHERE id = 'c01f8245-fa3d-49c7-9854-4b4909f965c2';
  `);
};

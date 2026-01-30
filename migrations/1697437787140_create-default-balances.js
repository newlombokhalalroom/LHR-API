exports.up = async (pgm) => {
  const insertNewBalances = async () => {
    const usersWithoutBalance = await pgm.db.query(
      'SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM balances)',
    );

    usersWithoutBalance.rows.forEach(async (user) => {
      await pgm.db.query(
        'INSERT INTO balances (user_id, amount) VALUES ($1, $2)',
        [user.id, 0],
      );
    });
  };

  await insertNewBalances();
};

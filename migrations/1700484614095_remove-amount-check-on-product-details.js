exports.up = (pgm) => {
  pgm.sql('ALTER TABLE product_details DROP CONSTRAINT product_details_amount_check');
};

exports.down = (pgm) => {
  pgm.sql('ALTER TABLE product_details ADD CHECK (amount >= 0)');
};

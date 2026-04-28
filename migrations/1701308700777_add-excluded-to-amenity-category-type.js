exports.up = (pgm) => {
  pgm.sql("ALTER TYPE amenity_category ADD VALUE 'excluded';");
};
exports.down = (pgm) => {
  pgm.sql("DELETE FROM pg_enum WHERE enumlabel = 'excluded' AND enumtypid = 'amenity_category'::regtype;");
};

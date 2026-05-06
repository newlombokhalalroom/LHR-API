/* eslint-disable camelcase */

exports.up = (pgm) => {
  // Create Enum for Schedule Status if not exists
  pgm.addType('schedule_status', ['ready', 'full', 'cancelled']);

  pgm.createTable('tour_schedules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: '"products"',
      onDelete: 'CASCADE',
    },
    total_quota: {
      type: 'integer',
      notNull: true,
      check: 'total_quota > 0',
    },
    available_quota: {
      type: 'integer',
      notNull: true,
    },
    departure_date: {
      type: 'date',
      notNull: true,
    },
    return_date: {
      type: 'date',
      notNull: true,
    },
    status: {
      type: 'schedule_status',
      default: 'ready',
    },
    _created_at: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    _updated_at: {
      type: 'timestamp with time zone',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint('tour_schedules', 'check_quota_balance', {
    check: 'available_quota <= total_quota AND available_quota >= 0',
  });

  pgm.createIndex('tour_schedules', 'product_id');
};

exports.down = (pgm) => {
  pgm.dropTable('tour_schedules');
  pgm.dropType('schedule_status');
};

exports.up = (pgm) => {
    pgm.createTable('products_options', {
        option_id: {
            type: 'uuid',
            notNull: true,
        },
        product_id: {
            type: 'uuid',
            notNull: true,
        },
        price: {
            type: 'numeric',
            notNull: true,
            check: 'price >= 0',
        },
        _created_date: {
            type: 'timestamptz',
            default: pgm.func('current_timestamp'),
        },
        _updated_date: {
            type: 'timestamptz',
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.addConstraint('products_options', 'fk_products_options.product_id_products.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
    pgm.addConstraint('products_options', 'fk_products_options.option_id_options.id', 'FOREIGN KEY(option_id) REFERENCES options(id) ON DELETE CASCADE');
    pgm.addConstraint('products_options', 'unique_option_id_and_product_id', 'UNIQUE(option_id, product_id)');
};

exports.down = (pgm) => {
    pgm.dropConstraint('products_options', 'unique_option_id_and_product_id');
    pgm.dropConstraint('products_options', 'fk_products_options.product_id_products.id');
    pgm.dropConstraint('products_options', 'fk_products_options.option_id_options.id');
    pgm.dropTable('products_options');
};

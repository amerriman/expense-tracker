
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', function(table){
    table.increments('id');
    table.string('cat_username').notNullable().references('username').inTable('users').onDelete('CASCADE');
    table.string('user_indiv').notNullable();
    table.string('category_name').notNullable();
    table.string('type').notNullable();
    table.boolean('repeat').nullable();
    table.decimal('repeat_amount', 6, 2).notNullable();
  });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('categories');
};

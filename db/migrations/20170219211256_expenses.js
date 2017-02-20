
exports.up = function(knex, Promise) {
  return knex.schema.createTable('expenses', function(table){
    table.increments('id');
    table.string('user_name').notNullable().references('username').inTable('users');
    table.string('user_indiv').nullable();
    table.date('date').notNullable();
    table.decimal('amount', 6, 2).notNullable();
    table.string('category').notNullable();
    table.string('description').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('expenses');
};

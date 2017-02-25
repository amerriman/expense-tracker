
exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', function(table){
    table.increments('id').primary();
    table.string('trans_username').notNullable().references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('user_indiv').nullable();
    table.date('date').notNullable();
    table.decimal('amount', 6, 2).notNullable();
    table.string('category').notNullable();
    table.string('description').nullable();
    table.string('type').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions');
};

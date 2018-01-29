
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('transactions', function (table) {
    table.decimal('amount', 8, 2).notNullable().alter();
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.alterTable('transactions', function(table){
    table.decimal('amount', 6, 2).notNullable();
  })
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable('spending', function(table){
    table.increments();
    table.string('username').notNullable();
    table.string('user').notNullable();
    table.date('date').notNullable();
    table.decimal('channel', 6, 2).notNullable();
    table.string('category').notNullable();
    table.string('description').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('spending');
};

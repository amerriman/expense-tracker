exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id');
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.string('email').nullable().unique();
    table.string('users').nullable();
    table.string('image').nullable();
    table.string('googleid').nullable();
  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

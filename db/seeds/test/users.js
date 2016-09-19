
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          username: 'testUser',
          password: 'test',
          email: 'test@test.com',
          users: 'Mr User, Ms User'
        }),
        knex('users').insert({
          username: 'testUser2',
          password: 'test2',
          email: 'test2@test.com',
          users: 'Mr User2, Ms User2'
        }),

      ]);
    });
};


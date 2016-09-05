
exports.seed = function(knex, Promise) {
  return knex('spending').del() // Deletes ALL existing entries
    .then(function() { // Inserts seed entries one by one in series
      return knex('spending').insert({
        username: 'User',
        user: 'Mr User',
        date: '2016-09-01',
        amount: 35.63,
        category: 'groceries',
        description: null
      });
    }).then(function () {
      return knex('spending').insert({
        username: 'User',
        user: 'Ms User',
        date: '2016-09-01',
        amount: 57.22,
        category: 'clothing',
        description: 'New work shoes'
      });
    }).then(function () {
      return knex('spending').insert({
        username: 'User',
        user: 'Mr User',
        date: '2016-09-01',
        amount: 109.83,
        category: 'groceries',
        description: 'Weekly groceries'
      });
    }).then(function () {
      return knex('spending').insert({
        username: 'User',
        user: 'Ms User',
        date: '2016-10-01',
        amount: 34.78,
        category: 'car',
        description: 'gas'
      });
    });
};


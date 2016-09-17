
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('spending').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('spending').insert({
          user_id: 1,
          user_indiv: 'Mr User',
          date: '2016-09-01',
          amount: 35.63,
          category: 'groceries',
          description: null
        }),
        knex('spending').insert({
          user_id: 1,
          user_indiv: 'Ms User',
          date: '2016-09-01',
          amount: 57.22,
          category: 'clothing',
          description: 'New work shoes'
        }),
        knex('spending').insert({
          user_id: 1,
          user_indiv: 'Mr User',
          date: '2016-09-01',
          amount: 109.83,
          category: 'groceries',
          description: 'Weekly groceries'
        }),
        knex('spending').insert({
          user_id: 1,
          user_indiv: 'Ms User',
          date: '2016-10-01',
          amount: 34.78,
          category: 'car',
          description: 'gas'
        })
      ]);
    });
};

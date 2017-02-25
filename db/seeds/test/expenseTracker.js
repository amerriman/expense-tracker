
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries - then insert
  return knex('users').del()
    .then(function(){
      return knex('transactions').del();
    }).then(function(){
      return knex('categories').del();
    }).then(function () {
      return knex('users').insert({
        // id: 1,
        username: 'testUser',
        password: 'test',
        email: 'test@test.com',
        users: 'Mr User, Ms User'
      });
    }).then(function(){
      return knex('users').insert({
        // id: 2,
        username: 'testUser2',
        password: 'test2',
        email: 'test2@test.com',
        users: 'Mr User2, Ms User2'
      });
    }).then(function () {
      return knex('transactions').insert({
        trans_username: 'testUser',
        user_indiv: 'Mr User',
        date: '2016-09-01',
        amount: 35.63,
        category: 'groceries',
        description: null,
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser',
        user_indiv: 'Ms User',
        date: '2016-09-01',
        amount: 57.22,
        category: 'clothing',
        description: 'New work shoes',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser',
        user_indiv: 'Mr User',
        date: '2016-09-010',
        amount: 109.83,
        category: 'groceries',
        description: 'Weekly groceries',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser',
        user_indiv: 'Ms User',
        date: '2016-10-03',
        amount: 34.78,
        category: 'car',
        description: 'gas',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser',
        user_indiv: 'Ms User',
        date: '2016-10-15',
        amount: 2000,
        category: 'car',
        description: 'paycheck',
        type: 'income'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser2',
        user_indiv: 'Ms User2',
        date: '2016-09-01',
        amount: 75.22,
        category: 'pets',
        description: 'Cat food',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser2',
        user_indiv: 'Mr User2',
        date: '2016-09-010',
        amount: 60.14,
        category: 'food',
        description: 'Birthday dinner stuff',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser2',
        user_indiv: 'Ms User2',
        date: '2016-10-03',
        amount: 20.20,
        category: 'auto',
        description: 'gas station',
        type: 'expense'
      });
    }).then(function (){
      return knex('transactions').insert({
        trans_username: 'testUser2',
        user_indiv: 'Ms User2',
        date: '2016-10-15',
        amount: 1000,
        category: 'car',
        description: 'Quarterly bonus',
        type: 'income'
      });
    }).then(function (){
      return knex('categories').insert({
        cat_username: 'testUser',
        category_name: 'groceries',
        type: 'expense',
        repeat: false,
      });
    }).then(function (){
      return knex('categories').insert({
        cat_username: 'testUser',
        category_name: 'Ms User paycheck',
        type: 'income',
        repeat: true,
        repeat_amount: 2000
      });
    }).then(function (){
      return knex('categories').insert({
        cat_username: 'testUser2',
        category_name: 'cats',
        type: 'expense',
      });
    }).then(function (){
      return knex('categories').insert({
        cat_username: 'testUser2',
        category_name: 'Mortgage',
        type: 'expense',
        repeat: true,
        repeat_amount: 1376.42
    });
  });
};

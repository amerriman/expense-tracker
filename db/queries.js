var knex = require('./knex.js');

function Spending() {
  return knex('spending');
}

// *** queries *** //

function getAll() {
  return Spending().select();
}

function getSingle(id){
return Spending().where('id', parseInt(id)).first();
}

function add(expense) {
  return Spending().insert(expense, 'id');
}

function update(expenseID, updates) {
  return Spending().where('id', parseInt(expenseID)).update(updates);
}

function deleteItem(expenseID) {
  return Spending().where('id', parseInt(expenseID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  add: add,
  update: update,
  deleteItem: deleteItem
};

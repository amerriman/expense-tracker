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

function addExpense(expense) {
  return Spending().insert(expense, 'id');
}

function updateExpense(expenseID, updates) {
  return Spending().where('id', parseInt(expenseID)).update(updates);
}

function deleteExpense(expenseID) {
  return Spending().where('id', parseInt(expenseID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  addExpense: addExpense,
  updateExpense: updateExpense,
  deleteExpense: deleteExpense
};

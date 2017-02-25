var knex = require('./knex.js');

function Transactions() {
  return knex('transactions');
}

// *** queries *** //

function getAll() {
  return Transactions().select();
}

function getSingle(id){
return Transactions().where('id', parseInt(id)).first();
}

function addTransaction(expense) {
  return Transactions().insert(expense, 'id');
}

function updateTransactions(expenseID, updates) {
  return Transactions().where('id', parseInt(expenseID)).update(updates);
}

function deleteTransaction(expenseID) {
  return Transactions().where('id', parseInt(expenseID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  addTransaction: addTransaction,
  updateTransactions: updateTransactions,
  deleteTransaction: deleteTransaction
};

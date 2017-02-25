var knex = require('./knex.js');

function Transactions() {
  return knex('transactions');
}

// *** queries *** //
//get all the transactions for a specific username
function getAll(trans_username) {
  // return Transactions().select();
  return Transactions().where('trans_username', trans_username);
}

function getSingle(id){
return Transactions().where('id', parseInt(id)).first();
}

function addTransaction(transaction) {
  return Transactions().insert(transaction, 'id');
}

function updateTransactions(transactionID, updates) {
  return Transactions().where('id', parseInt(transactionID)).update(updates);
}

function deleteTransaction(transactionID) {
  return Transactions().where('id', parseInt(transactionID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  addTransaction: addTransaction,
  updateTransactions: updateTransactions,
  deleteTransaction: deleteTransaction
};

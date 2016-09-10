var knex = require('./knex.js');

function Spending() {
  return knex('spending');
}

// *** queries *** //

function getAll() {
  return Spending().select();
}


module.exports = {
  getAll: getAll
};

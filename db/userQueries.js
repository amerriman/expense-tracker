var knex = require('./knex.js');

function Users() {
  return knex('users');
}

// *** queries *** //

function getAll() {
  return Users().select();
}

//the first makes the return an object, otherwise it's an array with a single object
function getSingle(id){
return Users().where('id', parseInt(id)).first();
}

function addUser(user) {
  return Users().insert(user, 'id');
}

function updateUser(userID, updates) {
  return Users().where('id', parseInt(userID)).update(updates);
}

function deleteUser(userID) {
  return Users().where('id', parseInt(userID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};




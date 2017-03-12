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
return Users().where('username', id).first();
}

function getSingleById(id){
return Users().where('id', id).first();
}

function addUser(user) {
  return Users().insert(user, 'username');
}

function updateUser(id, updates) {
  return Users().where('username', id).update(updates);
}

function deleteUser(id) {
  return Users().where('username', id).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  getSingleById: getSingleById,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};




var knex = require('./knex.js');

function Categories() {
  return knex('categories');
}

// *** queries *** //
//get all the categories for a specific username
function getAll(cat_username) {
  return Categories().where('cat_username', cat_username);
}

function getSingle(id){
  return Categories().where('id', parseInt(id)).first();
}

function addCategory(category) {
  return Categories().insert(category, 'id');
}

function updateCategory(categoryID, updates) {
  return Categories().where('id', parseInt(categoryID)).update(updates);
}

function deleteCategory(categoryID) {
  return Categories().where('id', parseInt(categoryID)).del();
}


module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  addCategory: addCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
};

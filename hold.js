// router.delete('/spending/:id', function(req, res, next){
//   expense.deleteItem(req.params.id)
//   .then(function(expense){
//     res.status(200).json(expense);
//   })
//   .catch(function(error){
//     next(error);
//   });
// });

var knex = require('./../knex');

function Users() {
    return knex('users');
}

module.exports = {

    getUsers: function() {
        return Users()
    },

    getUser: function(id) {
        return Users()
            .where('id', id);
    },

    addUser: function(body) {
        return Users()
            .insert({
                user_name: body.user_name,
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email
            })
    },

    updateUser: function(id, body) {
        return Users()
            .where('id', id)
            .update({
                user_name: body.user_name,
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email
            })
    },

    deleteUser: function(id) {
        return Users()
            .where('id', id)
            .del();
    }
}

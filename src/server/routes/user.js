var express = require('express');
var router = express.Router();

var Users = require('../../../db/userQueries');



router.get('/users', function(req, res, next) {
  Users.getAll()
  .then(function(users) {
    res.status(200).json(users);
  })
  .catch(function(error){
    next(error);
  });
});


router.get('/user/:id', function(req, res, next) {
  Users.getSingle(req.params.id)
  .then(function(user) {
    res.status(200).json(user);
  })
  .catch(function(error){
    next(error);
  });
});


router.post('/user', function(req, res, next) {
  Users.addUser(req.body, 'username')
  .then(function(username) {
    // console.log(username, "username")
    return Users.getSingle(username[0]);
  })
  .then(function(user){
    res.status(200).json(user);
  })
  .catch(function(error){
    next(error);
  });
});


router.put('/user/:id', function(req,res,next) {
  Users.updateUser(req.params.id, req.body)
  .then(function() {
    return Users.getSingle(req.params.id);
  })
  .then(function(user){
    res.status(200).json(user);
  })
  .catch(function(error){
    next(error);
  });
});


router.delete('/user/:id', function(req,res,next) {
  Users.getSingle(req.params.id)
  .then(function(user){
    Users.deleteUser(req.params.id)
    .then(function(){
      res.status(200).json(user);
    })
    .catch(function(err){
      next(err);
    });
  }).catch(function(err){
    next(err);
  });
});


module.exports = router;

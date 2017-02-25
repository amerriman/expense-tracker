var express = require('express');
var router = express.Router();

var Categories = require('../../../db/categoryQueries');


// *** GET all categories for a spacific username *** //
router.get('/:cat_username', function(req, res, next) {
  Categories.getAll(req.params.cat_username)
  .then(function(category) {
    res.status(200).json(category);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** GET single category - *** //
router.get('/category/:id', function(req, res, next) {
  // console.log(req.params, "req params!")
  Categories.getSingle(req.params.id)
  .then(function(category) {
    res.status(200).json(category);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** add category *** //
router.post('/category', function(req, res, next) {
  Categories.addCategory(req.body, 'id')
  .then(function(categoryID) {
    return Categories.getSingle(categoryID);
  })
  .then(function(category) {
    res.status(200).json(category);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** update category *** //
router.put('/category/:id', function(req, res, next) {
  Categories.updateCategory(req.params.id, req.body)
  .then(function() {
    return Categories.getSingle(req.params.id);
  })
  .then(function(category) {
    res.status(200).json(category);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** delete category *** //
router.delete('/category/:id', function(req, res, next) {
  Categories.getSingle(req.params.id)
  .then(function(category) {
    Categories.deleteCategory(req.params.id)
    .then(function() {
      res.status(200).json(category);
    })
    .catch(function(error) {
      next(error);
    });
  }).catch(function(error) {
    next(error);
  });
});


module.exports = router;

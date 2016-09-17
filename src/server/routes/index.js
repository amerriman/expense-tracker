var express = require('express');
var router = express.Router();

var queries = require('../../../db/queries');

// router.get('/', function(req, res, next) {
//   res.render('index.html');
// });

// *** GET all expenses *** //
router.get('/spending', function(req, res, next) {
  queries.getAll()
  .then(function(expenses) {
    res.status(200).json(expenses);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** GET single expense *** //
router.get('/spending/:id', function(req, res, next) {
  queries.getSingle(req.params.id)
  .then(function(expense) {
    res.status(200).json(expense);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** add expense *** //
router.post('/spending', function(req, res, next) {
  queries.add(req.body, 'id')
  .then(function(expenseID) {
    return queries.getSingle(expenseID);
  })
  .then(function(expense) {
    res.status(200).json(expense);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** update expense *** //
router.put('/spending/:id', function(req, res, next) {
  queries.update(req.params.id, req.body)
  .then(function() {
    return queries.getSingle(req.params.id);
  })
  .then(function(expense) {
    res.status(200).json(expense);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** delete expense *** //
router.delete('/spending/:id', function(req, res, next) {
  queries.getSingle(req.params.id)
  .then(function(expense) {
    queries.deleteItem(req.params.id)
    .then(function() {
      res.status(200).json(expense);
    })
    .catch(function(error) {
      next(error);
    });
  }).catch(function(error) {
    next(error);
  });
});

module.exports = router;

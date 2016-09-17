var express = require('express');
var router = express.Router();

var Expense = require('../../../db/expenseQueries');


// *** GET all expenses *** //
router.get('/spending', function(req, res, next) {
  Expense.getAll()
  .then(function(expenses) {
    res.status(200).json(expenses);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** GET single expense *** //
router.get('/spending/:id', function(req, res, next) {
  Expense.getSingle(req.params.id)
  .then(function(expense) {
    res.status(200).json(expense);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** add expense *** //
router.post('/spending', function(req, res, next) {
  Expense.addExpense(req.body, 'id')
  .then(function(expenseID) {
    return Expense.getSingle(expenseID);
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
  Expense.updateExpense(req.params.id, req.body)
  .then(function() {
    return Expense.getSingle(req.params.id);
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
  Expense.getSingle(req.params.id)
  .then(function(expense) {
    Expense.deleteExpense(req.params.id)
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

//can also do this, but then it return a number (index?) so, doing it the above way returns the item that was deleted for better verification
// router.delete('/spending/:id', function(req, res, next){
//   expense.deleteItem(req.params.id)
//   .then(function(expense){
//     res.status(200).json(expense);
//   })
//   .catch(function(error){
//     next(error);
//   });
// });

module.exports = router;

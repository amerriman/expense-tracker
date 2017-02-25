var express = require('express');
var router = express.Router();

var Transactions = require('../../../db/transactionQueries');


// *** GET all transactions for a spacific username *** //
router.get('/:trans_username', function(req, res, next) {
  Transactions.getAll(req.params.trans_username)
  .then(function(transaction) {
    res.status(200).json(transaction);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** GET single transaction - *** //
router.get('/transactions/:id', function(req, res, next) {
  // console.log(req.params, "req params!")
  Transactions.getSingle(req.params.id)
  .then(function(transaction) {
    res.status(200).json(transaction);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** add transaction *** //
router.post('/transactions', function(req, res, next) {
  Transactions.addTransaction(req.body, 'id')
  .then(function(transactionID) {
    return Transactions.getSingle(transactionID);
  })
  .then(function(transaction) {
    res.status(200).json(transaction);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** update transaction *** //
router.put('/transactions/:id', function(req, res, next) {
  Transactions.updateTransactions(req.params.id, req.body)
  .then(function() {
    return Transactions.getSingle(req.params.id);
  })
  .then(function(transaction) {
    res.status(200).json(transaction);
  })
  .catch(function(error) {
    next(error);
  });
});

// *** delete transaction *** //
router.delete('/transactions/:id', function(req, res, next) {
  Transactions.getSingle(req.params.id)
  .then(function(transaction) {
    Transactions.deleteTransaction(req.params.id)
    .then(function() {
      res.status(200).json(transaction);
    })
    .catch(function(error) {
      next(error);
    });
  }).catch(function(error) {
    next(error);
  });
});

//can also do this, but then it return a number (index?) so, doing it the above way returns the item that was deleted for better verification
// router.delete('/transactions/:id', function(req, res, next){
//   expense.deleteItem(req.params.id)
//   .then(function(transaction){
//     res.status(200).json(transaction);
//   })
//   .catch(function(error){
//     next(error);
//   });
// });

module.exports = router;

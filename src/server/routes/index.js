var express = require('express');
var router = express.Router();

var queries = require('../../../db/queries');

router.get('/', function(req, res, next) {
  res.render('index.html');
});

// *** GET all spending *** //
router.get('/spending', function(req, res, next) {
  queries.getAll()
  .then(function(spending) {
    res.status(200).json(spending);
  })
  .catch(function(error) {
    next(error);
  });
});

module.exports = router;

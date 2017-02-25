// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// *** config file *** //
var config = require('../../_config.js');

// *** routes *** //
var categoryRoutes = require('./routes/category.js');
var transactionRoutes = require('./routes/transaction.js');
var userRoutes = require('./routes/user.js');
var authRoutes = require('./routes/auth.js');


// *** express instance *** //
var app = express();

// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //
app.use('/categoryAPI', categoryRoutes);
app.use('/transactionAPI', transactionRoutes);
app.use('/userAPI', userRoutes);
app.use('/auth', authRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// // *** error handlers *** //

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.send({
//       message: err.message,
//       error: err
//     });
//   });
// }


// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.send({
//     message: err.message,
//     error: {}
//   });
// });

// error handlers **********

// development error handler - returns JSON here
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;

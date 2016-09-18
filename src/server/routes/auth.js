var express = require('express');
var router = express.Router();
var moment = require('moment');
var knex = require('../../../db/knex');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var config = require('../../../_config');

// *** login required *** // (user in the update eventually)
function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({
      message: 'You did not provide a JSON Web Token in the authorization header.'
    });
  }

  // decode the token
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);
  console.log(payload, "PAYLOAD IN THE ENSURE AUTHENTICATED")
  var now = moment().unix();

  // check if the token has expired
  if (now > payload.exp) {
    return res.status(401).send({
      message: 'Token has expired.'
    });
  }

  // check if the user still exists in the db - modify for psql to set the user?
  knex('users').where('id', payload.sub)
  .then(function(data){
    if(!data){
        return res.status(400).send({
            message: 'Teacher no longer exists. '
      });
    }
    req.user = user;
    next();
  });

  // Teacher.findById(payload.sub, function(err, user) {
  //   if (!user) {
  //     return res.status(400).send({
  //       message: 'Teacher no longer exists. '
  //     });
  //   }
  //   req.user = user;
  //   next();
  // });
}


// *** generate token *** //
function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user.id
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}


function hashing (password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hashedpassword) {
    return bcrypt.compareSync(password, hashedpassword);
}

// Create Email and Password Account

router.post('/signup', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    // check if email is unique
    knex('users').where('email',email)
        .then(function(data){
            // if username is in the database send an error
            if(data.length) {
                return res.status(409).send({
                     message: 'Email is already taken'
                });
            } else {
                // hash and salt the password
                var hashedPassword = hashing(password);
                // if user is not in the database, insert
                knex('users').insert({
                        email: email,
                        password: hashedPassword
                    })
                    .returning('id')
                    .into('users')
                    .then(function(user) {

                        var token = createToken(user);
                        res.send({
                            token: token,
                            user: user
                        });
                    })
                    .catch(function(err) {
                        return res.json('crap');
                    });
            }
        })
        .catch(function(err){
            return next(err);
        });
});

// Login with email and password

router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    knex('users').where('email', email)
        .then(function(data) {
            // email does not exist. return error.
            if (!data.length) {
                return res.send('Incorrect email.');
            }
            var user = data[0];
            // email found but do the passwords match?
            if (comparePassword(password, user.password)) {
                // passwords match! return user
                var token = jwt.sign(user, 'superSecret', {
                    expiresIn: 14400 // expires in 24 hours;
                });

                res.json({
                    user: user.id,
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            } else {
                // passwords don't match! return error
                return res.send('Incorrect password.');
            }
        })
        .catch(function(err) {
            // issue with SQL/knex query
            return res.send('Incorrect email and/or password.');
        });
});

module.exports = router;


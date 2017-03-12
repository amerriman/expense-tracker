var express = require('express');
var router = express.Router();
var moment = require('moment');
var knex = require('../../../db/knex');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var request = require('request');

var config = require('../../../config');

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
  var now = moment().unix();

  // check if the token has expired
  if (now > payload.exp) {
    return res.status(401).send({
      message: 'Token has expired.'
    });
  }

  // check if the user still exists in the db - modify for psql to set the user?
  knex('users').where('id', payload.sub)
  .then(function(user){
    if(!user){
        return res.status(400).send({
            message: 'User no longer exists. '
      });
    }
    req.user = user;
    next();
  });
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
    var password = req.body.password;
    var username = req.body.username;
    // check if email is unique
    knex('users').where('username',username)
        .then(function(data){
            // if username is in the database send an error
            if(data.length) {
                return res.status(409).send({
                     message: 'username is already taken'
                });
            } else {
                // hash and salt the password
                var hashedPassword = hashing(password);
                // if user is not in the database, insert
                knex('users').insert({
                        password: hashedPassword,
                        username: username
                    }, 'id')
                    .then(function(userID) {
                        knex('users').where('id', parseInt(userID)).first()
                        .then(function(user){
                            //do we even need to do this?  Shouldn't we just send them to the login page right away? Why are we sending a token?
                            var token = createToken(user);
                            var userData = {
                                userId: user.id,
                                username: user.username,
                                users: user.users,
                                image: user.image
                            };
                            res.send({
                                token: token,
                                user: userData
                            });
                        });
                    })
                    .catch(function(err) {
                        // console.log('signup failed', err);
                        return res.json('Signup failed');
                    });
            }
        })
        .catch(function(err){
        // console.log('signup failed', err);
            return next(err);
        });
});

// Login with email and password

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    knex('users').where('username', username)
        .then(function(data) {
            // username does not exist. return error.
            if (!data.length) {
                return res.send('Incorrect username.');
            }
            var user = data[0];
            // username found but do the passwords match?
            if (comparePassword(password, user.password)) {
                // passwords match! return user
                var token = createToken(user);
                var userData = {
                    userId: user.id,
                    username: user.username,
                    users: user.users,
                    image: user.image
                };
                res.json({
                    user: userData,
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
            return res.send('Incorrect username and/or password.');
        });
});

//Google Login
router.post('/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "NnHIA98FQJoL7WFEnG1sgTz5",
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        knex('users').where('email', profile.email)
        .then(function(existingUser){
            if(existingUser){
                return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            knex('users').where('email', payload.email)
            .then(function(user){
                if (!user) {
                    return res.status(400).send({ message: 'User not found' });
                }
                knex('users').where('email', payload.email).update({googleid: profile.sub })
                .then(function(user){
                })
                .catch(function(error){
                });

            });
        });

      } else {
        // Step 3b. Create a new user account or return an existing one.
        knex('users').where('email', profile.email)
        .then(function(existingUser){
            if(existingUser[0]){
                 var userData = {
                    userId: existingUser[0].id,
                    username: existingUser[0].username,
                    users: existingUser[0].users,
                    image: existingUser[0].image
                };
                return res.send({
                    token: createToken(existingUser),
                    user: userData
                });
            }
            var hashedPassword = hashing(profile.sub);
            knex('users').insert({
                googleid: profile.sub,
                email: profile.email,
                username: profile.name,
                password: hashedPassword
            }, 'id')
            .then(function(userID) {
                knex('users').where('id', parseInt(userID)).first()
                .then(function(user){
                    var token = createToken(user);
                    var userData = {
                        userId: user.id,
                        username: user.username,
                        users: user.users,
                        image: user.image
                    };
                    res.send({
                        token:token,
                        user: userData
                    });
                });
            })
            .catch(function(err) {
                return res.json('crap');
            });
        });
      }

    });
  });
});


module.exports = router;


var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

function hashing (password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hashedpassword) {
    return bcrypt.compareSync(password, hashedpassword);
}

// Create Email and Password Account

router.post('/register', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    // check if email is unique
    knex('users').where('username', username)
        .then(function(data){
            // if username is in the database send an error
            if(data.length) {
                res.json('user existed');
            } else {
                // hash and salt the password
                var hashedPassword = hashing(password);
                // if username is not in the database insert it
                knex('users').insert({
                        email: email,
                        password: hashedPassword,
                        username: username
                    })
                    .returning('id')
                    .into('users')
                    .then(function(user) {

                        var token = jwt.sign(user, 'superSecret', {
                            expiresIn: 100800 // expires in 7 days;
                        });

                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
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

// Login with username and password

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
                var token = jwt.sign(user, 'superSecret', {
                    expiresIn: 100800 // expires in 7 days;
                });

                res.json({
                    data: user.id,
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

module.exports = router;


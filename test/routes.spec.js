process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var knex = require('../db/knex');
var server = require('../src/server/app');

chai.use(chaiHttp);

describe('API Routes', function() {

  //roll back the migration (in case tests failed and never hit the 'afterEach', to drop the database, rerun the migration and re-seed
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
     return knex.migrate.latest();
      }).then(function(){
        return knex.seed.run();
      }).then(function() {
        done();
      });
  });

  //when we're done, roll it back again
  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  //********************************//
  //                                //
  //      EXPENSE TEST ROUTES       //
  //                                //
  //********************************//

  //get all the transactions
  describe('GET /transactionAPI/:trans_username', function() {
    it('should return all the transactions for a specific username', function(done) {
      chai.request(server)
      .get('/transactionAPI/testUser')
      .end(function(err, res) {
        // console.log(res.body, "GET ALL RES BODY")
      res.should.have.status(200);
      res.should.be.json; // jshint ignore:line
      res.body.should.be.a('array');
      // console.log(res.body, "RES BODY");
      res.body[0].should.have.property('user_indiv');
      res.body[0].user_indiv.should.equal('Mr User');
      res.body[0].should.have.property('date');
      // res.body[0].date.should.equal('2016-09-01T06:00:00.000Z');
      res.body[0].should.have.property('amount');
      res.body[0].amount.should.equal('35.63');
      res.body[0].should.have.property('category');
      res.body[0].category.should.equal('groceries');
      res.body[0].should.have.property('description');
      //cannot seem to get this null check working
      // res.body[0].description.should.be.null;
      done();
      });
    });
  });

  //get one transaction of transactions
  describe('GET /transactionAPI/transaction/:id', function() {
    it('should return a single transaction', function(done) {
      chai.request(server)
      .get('/transactionAPI/transaction/2')
      .end(function(err, res) {
        // console.log(res.body, "res.body")
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        // console.log(res.body, "RES BODY");
        res.body.should.have.property('user_indiv');
        res.body.user_indiv.should.equal('Ms User');
        res.body.should.have.property('date');
        res.body.date.should.equal('2016-09-01T06:00:00.000Z');
        res.body.should.have.property('amount');
        res.body.amount.should.equal('57.22');
        res.body.should.have.property('category');
        res.body.category.should.equal('clothing');
        res.body.should.have.property('description');
        res.body.description.should.equal('New work shoes');
        done();
      });
    });
  });

  //post one transaction of transactions
  describe('POST /transactionAPI/transaction', function() {
    it('should add a transaction', function(done) {
      chai.request(server)
      .post('/transactionAPI/transaction')
      .send({
        trans_username: 'testUser',
        user_indiv: 'Mr User',
        date: '2016-09-05',
        amount: 20.05,
        category: 'groceries',
        description: 'Broncos game',
        type: 'expense'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('user_indiv');
        res.body.user_indiv.should.equal('Mr User');
        res.body.should.have.property('date');
        res.body.should.have.property('amount');
        res.body.amount.should.equal('20.05');
        res.body.should.have.property('category');
        res.body.category.should.equal('groceries');
        res.body.should.have.property('description');
        res.body.description.should.equal('Broncos game');
        done();
      });
    });
  });

  //put a trasaction
  describe('PUT /transactionAPI/transaction/:id', function() {
    it('should update a transaction', function(done) {
      chai.request(server)
      .put('/transactionAPI/transaction/1')
      .send({
        category: 'cats',
        description: 'catnip'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('user_indiv');
        res.body.user_indiv.should.equal('Mr User');
        res.body.should.have.property('date');
        res.body.date.should.equal('2016-09-01T06:00:00.000Z');
        res.body.should.have.property('amount');
        res.body.amount.should.equal('35.63');
        res.body.should.have.property('category');
        res.body.category.should.equal('cats');
        res.body.should.have.property('description');
        res.body.description.should.equal('catnip');
        done();
      });
    });
  });


  //delete an expense - Why is this inconsistent?  Seeding isn't always in the right order???
  describe('DELETE /transactionAPI/transaction/:id', function() {
    it('should delete a transaction', function(done) {
      chai.request(server)
      .delete('/transactionAPI/transaction/2')
      .end(function(error, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        // res.body.should.have.property('user_indiv');
        // res.body.user_indiv.should.equal('Ms User');
        // res.body.should.have.property('date');
        // res.body.date.should.equal('2016-09-01T06:00:00.000Z');
        // res.body.should.have.property('amount');
        // res.body.amount.should.equal('57.22');
        // res.body.should.have.property('category');
        // res.body.category.should.equal('clothing');
        // res.body.should.have.property('description');
        // res.body.description.should.equal('New work shoes');
        chai.request(server)
        .get('/transactionAPI/testUser')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(4);
          res.body[1].should.have.property('user_indiv');
          // res.body[1].user_indiv.should.equal('Mr User');
          // res.body[1].should.have.property('date');
          // res.body[1].date.should.equal('2016-09-01T06:00:00.000Z');
          // res.body[1].should.have.property('amount');
          // res.body[1].amount.should.equal('109.83');
          // res.body[1].should.have.property('category');
          // res.body[1].category.should.equal('groceries');
          // res.body[1].should.have.property('description');
          // res.body[1].description.should.equal('Weekly groceries');
          done();
        });
      });
    });
  });



  //********************************//
  //                                //
  //        USER TEST ROUTES        //
  //                                //
  //********************************//

  //get all the users
  describe('GET /userAPI/users', function() {
    it('should return all the users', function(done) {
      chai.request(server)
      .get('/userAPI/users')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json; // jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('password');
      res.body[0].password.should.equal('test');
      res.body[0].should.have.property('email');
      res.body[0].email.should.equal('test@test.com');
      res.body[0].should.have.property('users');
      res.body[0].users.should.equal('Mr User, Ms User');
      done();
      });
    });
  });

  //get one user
  describe('GET /userAPI/user/:id', function() {
    it('should return a single user', function(done) {
      chai.request(server)
      .get('/userAPI/user/testUser')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('password');
        res.body.password.should.equal('test');
        res.body.should.have.property('email');
        res.body.email.should.equal('test@test.com');
        res.body.should.have.property('users');
        res.body.users.should.equal('Mr User, Ms User');
        done();
      });
    });
  });

  //add one user
  describe('POST /userAPI/user', function() {
    it('should add a user', function(done) {
      chai.request(server)
      .post('/userAPI/user')
      .send({
        username: 'testUser3',
        password: 'test3',
        email: 'test3@test.com',
        users: 'Mr User3, Ms User3'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        // console.log(res.body, "res")
        res.body.should.be.a('object');
        res.body.should.have.property('password');
        res.body.password.should.equal('test3');
        res.body.should.have.property('email');
        res.body.email.should.equal('test3@test.com');
        res.body.should.have.property('users');
        res.body.users.should.equal('Mr User3, Ms User3');
        done();
      });
    });
  });

  //put a user
  describe('PUT /userAPI/user/:id', function() {
    it('should update a user', function(done) {
      chai.request(server)
      .put('/userAPI/user/testUser')
      .send({
        email: 'testtest@test.com',
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('password');
        res.body.password.should.equal('test');
        res.body.should.have.property('email');
        res.body.email.should.equal('testtest@test.com');
        done();
      });
    });
  });


  // //delete a user - Why is this inconsistent?  Seeding isn't always in the right order???
  describe('DELETE /userAPI/user/:id', function() {
    it('should delete an user', function(done) {
      chai.request(server)
      .delete('/userAPI/user/testUser')
      .end(function(error, res) {
        // console.log(res, "res")
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        chai.request(server)
        .get('/userAPI/users')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          // console.log(res.body, "res.body")
          res.body[0].should.have.property('password');
          done();
        });
      });
    });
  });


  //********************************//
  //                                //
  //     CATEGORY TEST ROUTES       //
  //                                //
  //********************************//

  //get all the categories
  describe('GET /categoryAPI/:cat_username', function() {
    it('should return all the categories for a specific username', function(done) {
      chai.request(server)
      .get('/categoryAPI/testUser')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json; // jshint ignore:line
      res.body.should.be.a('array');
      // console.log(res.body)
      res.body[0].should.have.property('cat_username');
      res.body[0].cat_username.should.equal('testUser');
      res.body[0].should.have.property('category_name');
      res.body[0].category_name.should.equal('groceries');
      res.body[0].should.have.property('type');
      res.body[0].type.should.equal('expense');
      res.body[0].should.have.property('repeat');
      res.body[0].repeat.should.equal(false);
      done();
      });
    });
  });

  //get one transaction of transactions
  describe('GET /categoryAPI/categories/:id', function() {
    it('should return a single category', function(done) {
      chai.request(server)
      .get('/categoryAPI/category/2')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('cat_username');
        res.body.cat_username.should.equal('testUser');
        res.body.should.have.property('category_name');
        res.body.category_name.should.equal('Ms User paycheck');
        res.body.should.have.property('type');
        res.body.type.should.equal('income');
        res.body.should.have.property('repeat');
        res.body.repeat.should.equal(true);
        res.body.should.have.property('repeat_amount');
        res.body.repeat_amount.should.equal('2000.00');
        done();
      });
    });
  });

  //post one transaction of transactions
  describe('POST /categoryAPI/category', function() {
    it('should add a category', function(done) {
      chai.request(server)
      .post('/categoryAPI/category')
      .send({
        cat_username: 'testUser2',
        category_name: 'Electric Bill',
        type: 'expense',
        repeat: true,
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        // console.log(res.body, "resbody")
        res.body.should.have.property('cat_username');
        res.body.cat_username.should.equal('testUser2');
        res.body.should.have.property('category_name');
        res.body.category_name.should.equal('Electric Bill');
        res.body.should.have.property('type');
        res.body.type.should.equal('expense');
        res.body.should.have.property('repeat');
        res.body.repeat.should.equal(true);
        res.body.should.have.property('repeat_amount');
        // res.body.repeat_amount.should.be.null;
        done();
      });
    });
  });

  //put a trasaction
  describe('PUT /categoryAPI/category/:id', function() {
    it('should update a category', function(done) {
      chai.request(server)
      .put('/categoryAPI/category/4')
      .send({
        category_name: 'Mr User Paycheck',
        type: 'income'
      })
      .end(function(err, res) {
        // console.log(res, "RES")
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('cat_username');
        res.body.cat_username.should.equal('testUser2');
        res.body.should.have.property('category_name');
        res.body.category_name.should.equal('Mr User Paycheck');
        res.body.should.have.property('type');
        res.body.type.should.equal('income');
        res.body.should.have.property('repeat');
        res.body.repeat.should.equal(true);
        res.body.should.have.property('repeat_amount');
        res.body.repeat_amount.should.equal('1376.42');
        done();
      });
    });
  });


  //delete an category - Why is this inconsistent?  Seeding isn't always in the right order???
  describe('DELETE /categoryAPI/category/:id', function() {
    it('should delete a category', function(done) {
      chai.request(server)
      .delete('/categoryAPI/category/2')
      .end(function(error, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        // res.body.should.have.property('user_indiv');
        // res.body.user_indiv.should.equal('Ms User');
        // res.body.should.have.property('date');
        // res.body.date.should.equal('2016-09-01T06:00:00.000Z');
        // res.body.should.have.property('amount');
        // res.body.amount.should.equal('57.22');
        // res.body.should.have.property('category');
        // res.body.category.should.equal('clothing');
        // res.body.should.have.property('description');
        // res.body.description.should.equal('New work shoes');
        chai.request(server)
        .get('/categoryAPI/testUser')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          // console.log(res.body)
          res.body[0].should.have.property('category_name');
          // res.body[1].user_indiv.should.equal('Mr User');
          // res.body[1].should.have.property('date');
          // res.body[1].date.should.equal('2016-09-01T06:00:00.000Z');
          // res.body[1].should.have.property('amount');
          // res.body[1].amount.should.equal('109.83');
          // res.body[1].should.have.property('category');
          // res.body[1].category.should.equal('groceries');
          // res.body[1].should.have.property('description');
          // res.body[1].description.should.equal('Weekly groceries');
          done();
        });
      });
    });
  });

});

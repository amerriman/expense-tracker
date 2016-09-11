process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var knex = require('../db/knex');

chai.use(chaiHttp);

describe('API Routes', function() {

  //roll back the migration (in case tests failed and never hit the 'afterEach', to drop the database, rerun the migration and re-seed
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  //when we're done, roll it back again
  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  //get all the spending
  describe('GET /api/spending', function() {
    it('should return all the spending', function(done) {
      chai.request(server)
      .get('/api/spending')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json; // jshint ignore:line
      res.body.should.be.a('array');
      // console.log(res.body, "RES BODY");
      res.body[0].should.have.property('user');
      res.body[0].user.should.equal('Mr User');
      res.body[0].should.have.property('date');
      res.body[0].date.should.equal('2016-09-01T06:00:00.000Z');
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

  //get one transaction of spending
  describe('GET /api/spending/:id', function() {
    it('should return a single spending transaction', function(done) {
      chai.request(server)
      .get('/api/spending/2')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        // console.log(res.body, "RES BODY");
        res.body.should.have.property('user');
        res.body.user.should.equal('Ms User');
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

  //post one transaction of spending
  describe('POST /api/spending', function() {
    it('should add a transaction', function(done) {
      chai.request(server)
      .post('/api/spending')
      .send({
        username: 'User',
        user: 'Mr User',
        date: '2016-09-05',
        amount: 20.05,
        category: 'groceries',
        description: 'Broncos game'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.user.should.equal('Mr User');
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
  describe('PUT /api/spending/:id', function() {
    it('should update an expense', function(done) {
      chai.request(server)
      .put('/api/spending/1')
      .send({
        category: 'cats',
        description: 'catnip'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.user.should.equal('Mr User');
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


  //delete an expense
  describe('DELETE /api/spending/:id', function() {
    it('should delete an expense', function(done) {
      chai.request(server)
      .delete('/api/spending/2')
      .end(function(error, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.user.should.equal('Ms User');
        res.body.should.have.property('date');
        res.body.date.should.equal('2016-09-01T06:00:00.000Z');
        res.body.should.have.property('amount');
        res.body.amount.should.equal('57.22');
        res.body.should.have.property('category');
        res.body.category.should.equal('clothing');
        res.body.should.have.property('description');
        res.body.description.should.equal('New work shoes');
        chai.request(server)
        .get('/api/spending')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[1].should.have.property('user');
          res.body[1].user.should.equal('Mr User');
          res.body[1].should.have.property('date');
          res.body[1].date.should.equal('2016-09-01T06:00:00.000Z');
          res.body[1].should.have.property('amount');
          res.body[1].amount.should.equal('109.83');
          res.body[1].should.have.property('category');
          res.body[1].category.should.equal('groceries');
          res.body[1].should.have.property('description');
          res.body[1].description.should.equal('Weekly groceries');
          done();
        });
      });
    });
  });

});

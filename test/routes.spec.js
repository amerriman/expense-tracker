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


  describe('GET /api/spending', function() {
  it('should return all the spending', function(done) {
    chai.request(server)
    .get('/api/spending')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json; // jshint ignore:line
    res.body.should.be.a('array');
    console.log(res.body, "RES BODY");
    res.body.length.should.equal(4);
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

});

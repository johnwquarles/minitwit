'use strict';

var expect = require('chai').expect;

var User = require('./User');
var mongo = require('../../lib/mongo/');

describe('User', function () {

  before(function (done) {
    mongo.connect(function () {
      var user = {_id: 'foo'};

      User.collection.insertOne(user, done);
    });
  });

  after(User.dropCollection);

  describe('constructor', function () {
    it('should return a User object', function () {
      var user = new User({});

      expect(user).to.be.an.instanceOf(User);
    });

    it('should return all required fields ', function () {
      var profile = {username: 'foo'};
      var user = new User(profile);

      expect(user).to.eql({ _id: 'foo' });
    });
  });

  describe('.create()', function () {
    it('should add a user to the database', function (done) {
      var profile = {username: 'bar'};

      User.count(function (err, initialCount) {
        if (err) { throw err; }
        expect(initialCount).to.equal(1);

        User.create(profile, function () {
          User.count(function (err, newCount) {
            if (err) { throw err; }
            expect(newCount).to.equal(2);
            done();
          });
        });
      });
    });
  });

  describe('.findByUserName()', function () {
    it('should return a User object', function (done) {
      User.findByUserName('foo', function (err, user) {
        if (err) { throw err; }
        expect(user).to.be.an.instanceOf(User);
        done();
      });
    });

    it('should return the specific User object', function (done) {
      User.findByUserName('foo', function (err, user) {
        if (err) { throw err; }
        expect(user._id).to.equal('foo');

        User.findByUserName('bar', function (err, user) {
          if (err) { throw err; }
          expect(user._id).to.equal('bar');
          done();
        });
      });
    });
  });

  describe('.findOrCreate()', function () {
    it('should not create but return the user when it exists', function (done) {
      var profile = {username: 'foo'};

      User.count(function (err, initialCount) {
        if (err) { throw err; }
        expect(initialCount).to.equal(2);

        User.findOrCreate(profile, function (err, user) {
          if (err) { throw err; }

          User.count(function (err, newCount) {
            if (err) { throw err; }
            expect(newCount).to.equal(2);
            expect(user).to.be.an.instanceOf(User);
            expect(user._id).to.equal('foo');
            done();
          });
        });
      });
    });

    it('should create and return a new user when none exists', function (done) {
      var profile = {username: 'baz'};

      User.count(function (err, initialCount) {
        if (err) { throw err; }
        expect(initialCount).to.equal(2);

        User.findOrCreate(profile, function (err, user) {
          if (err) { throw err; }

          User.count(function (err, newCount) {
            if (err) { throw err; }
            expect(newCount).to.equal(3);
            expect(user).to.be.an.instanceOf(User);
            expect(user._id).to.equal('baz');
            done();
          });
        });
      });
    });
  });

  describe('.findByPattern()', () => {
    it('should return an array', done => {
      User.findByPattern('any pattern', (err, matches) => {
        if (err) throw err;
        expect(matches).to.be.an('array');
        done();
      });
    });

    it('should should respond with matches', done => {
      User.findByPattern('ba', (err, matches) => {
        if (err) throw err;
        expect(matches).to.deep.equal([
          { _id : 'bar' },
          { _id : 'baz' }
        ]);
        done();
      });
    });
  });
});

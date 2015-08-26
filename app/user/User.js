'use strict';

var _ = require('lodash');

var mongo = require('../../lib/mongo/');

function User(u) {
  this._id = u.username;
}

Object.defineProperty(User, 'collection', {
  get: function () {
    return mongo.getDb().collection('users');
  }
});

User.findOrCreate = function (profile, cb) {
  User.findByUserName(profile.username, function (err, user) {
    if (err) {
      return cb(err);
    }

    if (user) {
      return cb(null, user);
    } else {
      User.create(profile, cb);
    }
  });
};

User.create = function (u, cb) {
  var user = new User(u);

  User.collection.insertOne(user, function (err) {
    cb(err, user);
  });
};

User.findByUserName = function (username, cb) {
  User.collection.findOne({_id: username}, function (err, user) {
    if (user) {
      cb(err, setPrototype(user));
    } else {
      cb(err);
    }
  });
};

User.findByPattern = (pattern, cb) => {
  User.collection.find({
    _id : {$regex:pattern}
  }, {
    _id : 1
  }).toArray((err, matches) => {
    cb(err, matches);
  });
};

User.dropCollection = function (cb) {
  User.collection.drop(cb);
};

User.count = function (cb) {
  return User.collection.count(cb);
};

module.exports = User;

function setPrototype(pojo) {
  return _.create(User.prototype, pojo);
}

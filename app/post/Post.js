'use strict';

var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var mongo = require('../../lib/mongo/');

var pg = require('pg');
var url = 'postgres://localhost:5432'

// need to see if second argument is cb or if it's params.
function query(sql, paramsOrCb, cb) {
  pg.connect(`${url}/atmebro`, function (err, db, done) {
    if (err) throw err;

    if (typeof paramsOrCb === 'function') {
      db.query(sql, function (err, res) {
        paramsOrCb(err, res.rows);
      })
    } else {
      db.query(sql, paramsOrCb, function (err, res) {
        cb(err, res.rows);
      });
    }

    done();
  });
}

function bootstrap () {
  pg.connect(url, function(err, db, done) {
    if (err) throw err;

    db.query('CREATE DATABASE atmebro;', function(err) {
      // db already exists since this has been run before; shouldn't NEED err &&.
      if (err && err.message === 'database "atmebro" already exists') {
        pg.connect(`${url}/atmebro`, function (err, db, done) {
          if (err) throw err;
          db.query(`CREATE TABLE IF NOT EXISTS posts(
          _id SERIAL PRIMARY KEY NOT NULL,
          text VARCHAR(40) NOT NULL
          );`, done);
        });
        done();
      } else if (err) {
        throw err;
      }
    });
  });
}
bootstrap();

function Post(p) {
  this.text = p.text;
}

Object.defineProperty(Post, 'collection', {
  get: function () {
    return mongo.getDb().collection('posts');
  }
});

Post.count = function (cb) {
  query('SELECT COUNT(*) FROM posts;', cb);
};

Post.create = function (post, cb) {
  query('INSERT INTO posts (text) VALUES ($1)', [post.text], cb)
};

Post.setHidden = function (id, cb) {
  Post.collection.findOneAndUpdate({_id: ObjectID(id)},
    {$set: {hidden : true}},
    {returnOriginal : false},
  cb);
};

Post.dropCollection = function (cb) {
  Post.collection.drop(cb);
};

Post.findById = function (id, cb) {
  Post.collection.findOne({_id: ObjectID(id)}, function (err, post) {
    cb(err, setPrototype(post));
  });
};

Post.findAll = function (cb) {
  query('SELECT * FROM posts;', function (err, posts) {
    if (err) throw err;
    var prototypedPosts = posts.map(function (post) {
      return setPrototype(post);
    });
    cb(err, prototypedPosts);
  })
};

module.exports = Post;

function setPrototype(pojo) {
  return _.create(Post.prototype, pojo);
}

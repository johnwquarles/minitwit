'use strict';
var expect = require('chai').expect;

var Post = require('./Post');
var mongo = require('../../lib/mongo/');

describe('Post', function () {
  var seededPosts;

  before(function (done) {
    mongo.connect(function () {
      var seedPosts = [
        {text: 'Foo'},
        {text: 'Bar'}
      ];

      Post.collection.insertMany(seedPosts, function (err, result) {
        seededPosts = result.ops;
        done();
      });
    });
  });

  after(function (done) {
    Post.dropCollection(done);
  });

  describe('findById', function () {
    it('should return a Post object', function (done) {
      var id = seededPosts[0]._id;

      Post.findById(id, function (err, post) {
        expect(post).to.be.an.instanceOf(Post);
        done();
      });
    });

    it('should return the specific post', function (done) {
      var id1 = seededPosts[0]._id;
      var id2 = seededPosts[1]._id;

      Post.findById(id1, function (err, post) {
        expect(post.text).to.equal('Foo');

        Post.findById(id2, function (err, post) {
          expect(post.text).to.equal('Bar');
          done();
        });
      });
    });
  });

  describe('findAll', function () {
    it('should return Post objects', function (done) {
      Post.findAll(function (err, posts) {
        posts.forEach(function (post) {
          expect(post).to.be.an.instanceOf(Post);
        });
        done();
      });
    });
    it('should return all posts', function (done) {
      Post.findAll(function (err, posts) {
        expect(posts).to.deep.equal(seededPosts);
        done();
      });
    });
  });

  describe('.create()', function () {
    it('should add a post to the database', function (done) {
      Post.count(function (err, initialCount) {
        expect(initialCount).to.equal(2);
        Post.create({}, function () {
          Post.count(function (err, newCount) {
            expect(newCount).to.equal(3);
            done();
          });
        });
      });
    });
  });
});

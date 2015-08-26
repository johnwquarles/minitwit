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
        if (err) { throw err; }
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
        if (err) { throw err; }
        expect(post).to.be.an.instanceOf(Post);
        done();
      });
    });

    it('should return the specific post', function (done) {
      var id1 = seededPosts[0]._id;
      var id2 = seededPosts[1]._id;

      Post.findById(id1, function (err, post) {
        if (err) { throw err; }
        expect(post.text).to.equal('Foo');

        Post.findById(id2, function (err, post) {
          if (err) { throw err; }
          expect(post.text).to.equal('Bar');
          done();
        });
      });
    });
  });

  describe('findAll', function () {
    it('should return Post objects', function (done) {
      Post.findAll(function (err, posts) {
        if (err) { throw err; }
        posts.forEach(function (post) {
          expect(post).to.be.an.instanceOf(Post);
        });
        done();
      });
    });
    it('should return all posts', function (done) {
      Post.findAll(function (err, posts) {
        if (err) { throw err; }
        expect(posts).to.deep.equal(seededPosts);
        done();
      });
    });
  });

  describe('.create()', function () {
    it('should add a post to the database', function (done) {
      Post.count(function (err, initialCount) {
        if (err) { throw err; }
        expect(initialCount).to.equal(2);

        Post.create({}, function (err) {
          if (err) { throw err; }

          Post.count(function (err, newCount) {
            if (err) { throw err; }
            expect(newCount).to.equal(3);
            done();
          });
        });
      });
    });
  });

  describe('.setHidden()', function () {
    it('should set the post to contain hidden: true', function (done) {
      var id = seededPosts[0]._id;

      Post.findById(id, function (err, post) {
        if (err) { throw err; }
        expect(post.hidden).to.not.exist;

        Post.setHidden(post._id, function (err, result) {
          if (err) { throw err; }

          post.hidden = true;
          expect(result.value).to.deep.equal(post);
          done();
        });
      });
    });
  });
});

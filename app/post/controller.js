'use strict';

var Post = require('./Post');

// res.format will respond according to the Accept part of the request header.
// see http://expressjs.com/api.html#res.format
// can also include v3, v2, etc. (version number) in the header.
module.exports.index = function (req, res) {
  Post.findAll(function (err, posts) {
    if (err) { throw err; }
    res.format({
      html: function () {
        res.render('post/index', {posts: posts});
      },
      json: function () {
        res.send({posts: posts});
      }
    });
  });
};

module.exports.create = function (req, res) {
  Post.create(req.body, function (err) {
    if (err) { throw err; }
    res.redirect('/');
  });
};

module.exports.delete = function (req, res) {
  Post.setHidden(req.params.id, function (err) {
    if (err) { throw err; }
    res.redirect('/');
  });
};

module.exports.show = function (req, res, next) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { throw err; }

    if (post.hidden) {
      err = new Error('Not Found');
      err.status = 404;
      next(err);
    } else {
      res.render('post/show', {post: post});
    }
  });
};

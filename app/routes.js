'use strict';

var express = require('express');
var router = express.Router();

var home = require('./home/routes');
var post = require('./post/routes');
var user = require('./user/routes');

router.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

router.use('/', home);
router.use('/', post);
router.use('/', user);

module.exports = router;

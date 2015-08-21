'use strict';

var express = require('express');
var router = express.Router();

var home = require('./home/routes');
var post = require('./post/routes');

router.use('/', home);
router.use('/', post);

module.exports = router;

'use strict';

var _ = require('lodash');
var md5 = require('md5');

module.exports = function (email) {
  var url = 'http://www.gravatar.com/avatar/';
  return url + md5(_.trim(email).toLowerCase()) + '.jpg';
};

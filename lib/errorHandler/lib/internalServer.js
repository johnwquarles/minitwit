'use strict';

var errorhandler = require('errorhandler');

var app = require('../../../app/');

var env = app.get('env');

module.exports = function () {
  /* eslint-disable no-unused-vars, handle-callback-err */
  if (env === 'production') {
    return function (err, req, res, next) {
      var status = 500;
      var msg = 'Internal Server Error';

      res.status(status).format({
        html: function () {
          res.send(`<html><head><title>${msg}</title></head><body><h1>${msg}</h1></body></html>`);
        },
        json: function () {
          res.json({
            error: { message: msg }
          });
        }
      });
    };
  } else {
    return errorhandler();
  }
};

'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../../app/');

describe('Home Routes', function () {
  describe('GET /contact', function () {
    it('respond with contact', function (done) {
      request(app)
        .get('/contact')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.contain("I'm a contact page");
          done();
        });
    });
  });
});

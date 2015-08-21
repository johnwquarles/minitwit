'use strict';

var expect = require('chai').expect;

var getGravatar = require('./gravatar');

var gravatarURL = 'http://www.gravatar.com/avatar/d1827cb7215433baead881bb79520dd8.jpg';

describe('getGravatar', function () {
  it('should return the correct Gravatar URL when given a correctly formatted email address', function () {
    var email = 'noah.yarian@gmail.com';
    var output = getGravatar(email);

    expect(output).to.equal(gravatarURL);
  });
  it('should return the correct Gravatar URL when given an email address with leading and/or trailing whitespace', function () {
    var email = ' noah.yarian@gmail.com ';
    var output = getGravatar(email);

    expect(output).to.equal(gravatarURL);
  });
  it('should return the correct Gravatar URL when given an email address with uppercase letters', function () {
    var email = 'Noah.Yarian@Gmail.com';
    var output = getGravatar(email);

    expect(output).to.equal(gravatarURL);
  });
});

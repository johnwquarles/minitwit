'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./User');
var secrets = require('../../config/secrets');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findByUserName(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
  consumerKey: secrets.twitterAuth.consumerKey,
  consumerSecret: secrets.twitterAuth.consumerSecret,
  callbackURL: secrets.twitterAuth.callbackURL
}, function (token, tokenSecret, profile, done) {
  User.findOrCreate(profile, done);
}));

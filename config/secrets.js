'use strict';

var databaseName = process.env.NODE_ENV === 'test' ? 'minitwitdb-test' : 'minitwitdb';

module.exports = {
  db: process.env.MONGODB_URL || `mongodb://localhost:27017/${databaseName}`,
  sessionSecret: process.env.SESSION_SECRET || 'atmebroorbemtaatmebroorbemta',
  twitterAuth: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || '6QgleRPtf7E9mPaJQSspkmADS',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'fiViBrdSnaiGMT6CuYJWDFlbahU68xNuv7Cjc2MhEhB59uUD3e',
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/cb'
  }
};

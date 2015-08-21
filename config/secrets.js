'use strict';

var databaseName = process.env.NODE_ENV === 'test' ? 'minitwitdb-test' : 'minitwitdb';

module.exports = {
  db: process.env.MONGODB_URL || `mongodb://localhost:27017/${databaseName}`
};

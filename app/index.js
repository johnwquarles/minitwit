/* eslint-disable no-console */
'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var sass = require('node-sass-middleware');

var routes = require('./routes');
var database = require('../lib/mongo/');

var app = module.exports = express();

if (app.get('env') === 'test') {
  // random port
  app.set('port', 0);
} else {
  app.set('port', process.env.PORT || 3000);
}

app.set('views', __dirname);
app.set('view engine', 'jade');

app.locals.title = 'MiniTwit';

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('www'));
app.use(sass({
  dest: 'www/styles',
  outputStyle: 'compressed',
  prefix: '/styles',
  sourceMap: app.get('env') === 'production' ? 'false' : true,
  src: 'www/styles'
}));

app.use('/', routes);

require('../lib/errorHandler/');

database.connect(onDbConnect);

function onDbConnect(err, db) {
  if (err) {
    console.error(`Database Connection Error. ${err}`);
  } else {
    console.log(`Database Connection Established at ${db.options.url}`);
    startNodeListener();
  }
}

function startNodeListener() {
  var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    var mode = app.get('env');

    console.log(`Server listening on port ${port} in ${mode} mode...`);
  });
}

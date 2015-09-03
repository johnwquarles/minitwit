angular
  .module('atmebro', [])
  .controller('PostsCtrl', function ($http) {
    var post = this;

    $http
      .get('/')
      .success(function (res) {
        post.data = res.posts;
      })

  });

/* global horsey */

// use .key or use a library? .which || keycode

(function () {

  'use strict';

  var config = {
    element: 'input.entry',
    route: '/user/search',
    reqAtt: 'pattern',
    resAtt: '_id'
  };
  var DEL_KEY = 'U+0008',
      $element = $(config.element);

  $element.on('keyup', function () {
    var $eventTarget = $(event.target);
    var partBeforeAtMark = $eventTarget.val().split('@')[0];
    if (partBeforeAtMark[partBeforeAtMark.length - 1] === ' ' || partBeforeAtMark === '') {

      var partAfterAtMark = $eventTarget.val().split('@')[1];
      if (partAfterAtMark && partAfterAtMark.length >= 2 && event.keyIdentifier !== DEL_KEY) {
        if (config.horse) {
          config.horse.show();
        } else {
          getAutoData(partAfterAtMark, function (formattedData) {
            setHorsey(formattedData);
          });
        }
      }
      if (event.keyIdentifier === DEL_KEY && ((partAfterAtMark && partAfterAtMark.length <= 1) || partAfterAtMark === undefined)) {
        config.horse && config.horse.destroy();
        delete config.horse;
      }
    }
  });

  // move to a file to be imported here (utility functions);

  function weShouldTurnHorseyOn() {
    return partAfterAtMark && partAfterAtMark.length >= 2 && event.keyIdentifier !== DEL_KEY ? true: false;
  }

  function horseyOn() {
    if (config.horse) {
      config.horse.show();
    } else {
      getAutoData(partAfterAtMark, function (formattedData) {
        setHorsey(formattedData);
      });
    }
  }

  $element.on('keydown', function () {
    var $eventTarget = $(event.target);
    var partAfterAtMark = $eventTarget.val().split('@')[1];
    if (event.keyIdentifier === DEL_KEY && (partAfterAtMark && partAfterAtMark.length <= 3)) {
      config.horse && config.horse.hide();
    }
  });

  function getAutoData(str, cb) {
    var query = makeQuery(str);
    $.get(config.route, query, function (data) {
      var formattedData = formatResponse(data);
      cb(formattedData);
    });
  }

  function makeQuery(str) {
    var obj = {};
    obj[config.reqAtt] = str;
    return obj;
  }

  function formatResponse(data) {
    return data.map(function (obj) {
      return '@' + obj[config.resAtt];
    });
  }

  function setHorsey(formattedData) {
    config.horse = horsey($element[0], {
      suggestions: formattedData,
      anchor: '@'
    });
  }
})();

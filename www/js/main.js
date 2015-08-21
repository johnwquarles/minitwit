/* global horsey */

// Requires jQuery, Horsey, and configuration of the below config object.

(function () {

  'use strict';

  var config = {
    // HTML element to attach this to
    element: $('input.entry'),
    // backend route from which we get user objects (to get usernames for the suggestions)
    route: '/autocomplete/mention',
    // attribute of query object sent to backend with request
    reqAtt: 'pattern',
    // attribute we expect each object to have in the response
    // (expecting a JSON stringified array of objects)
    resAtt: 'username'
  };
  var DELKEY = 'U+0008';
  config.element.on('keyup', function (event) {
    var $eventTarget = $(event.target);
    var spaceCheck = $eventTarget.val().split('@')[0];
    if (spaceCheck[spaceCheck.length - 1] === ' ' || spaceCheck === '') {

      var str = $eventTarget.val().split('@')[1];
      if (str && str.length >= 2 && event.keyIdentifier !== DELKEY) {
        if (!config.horse) {
          getAutoData(str, function (formattedData) {
            setHorsey(formattedData);
          });
        } else {
          config.horse.show();
        }
      }
      if (event.keyIdentifier === DELKEY && ((str && str.length <= 1) || str === undefined)) {
        config.horse && config.horse.destroy();
        delete config.horse;
      }
    }
  });

  config.element.on('keydown', function (event) {
    var $eventTarget = $(event.target);
    var str = $eventTarget.val().split('@')[1];
    if (event.keyIdentifier === DELKEY && (str && str.length <= 3)) {
      config.horse && config.horse.hide();
    }
  });

  function getAutoData(str, cb) {
    $.getJSON(config.route, makeQuery(str), function (data) {
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
    config.horse = horsey($(config.element), {
      suggestions: formattedData,
      anchor: '@'
    });
  }
})();

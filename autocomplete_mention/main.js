/*eslint-env jquery */

// Requires jQuery, Horsey, and configuration of the below config object.

(function(){
  var config = {
    // HTML element to attach this to
    element: '.mention',
    // backend route from which we get user objects (to get usernames for the suggestions)
    route: '/mock',
    // attribute of query object sent to backend with request
    reqAtt: 'search',
    // attribute we expect each object to have in the response
    // (expecting a JSON stringified array of objects)
    resAtt: 'username'
  };

  $(config.element).on('keyup', function() {
    var spaceCheck = $(event.target).val().split('@')[0];
    if (spaceCheck[spaceCheck.length - 1] === ' ' || spaceCheck === "") {

      var str = $(event.target).val().split('@')[1];
      if (str && str.length >= 2 && event.keyIdentifier !== 'U+0008') {
        if (!config.horse) {
          getAutoData(str, function(formattedData) {
            setHorsey(formattedData);
          });
        } else {
          config.horse.show();
        }
      }
      if (event.keyIdentifier === 'U+0008' && ((str && str.length <= 1) || str === undefined)) {
        config.horse && config.horse.destroy();
        delete config.horse;
      }
    }
  });

  $(config.element).on('keydown', function() {
    var str = $(event.target).val().split('@')[1];
    if (event.keyIdentifier === 'U+0008' && (str && str.length <= 3)) {
      config.horse && config.horse.hide();
    }
  })

  function getAutoData(str, cb) {
    $.getJSON(config.route, makeQuery(str), function(data) {
      var formattedData = formatResponse(data);
      cb(formattedData);
    })
  }

  function makeQuery(str) {
    var obj = {};
    obj[config.reqAtt] = str;
    return obj;
  }

  function formatResponse(data) {
    return data.map(function(obj) {
      return '@' + obj[config.resAtt];
    })
  }

  function setHorsey(formattedData) {
    config.horse = horsey(document.querySelector(config.element), {
      suggestions: formattedData,
      anchor: '@'
    });
  }
})();

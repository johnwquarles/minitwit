/*eslint-env jquery */

// needs jQuery, jQuery-ui, jQuery-ui smoothness CSS theme
// (or we could make our own styling for the autocomplete menu and would just need the first two).

'use strict';

$(function() {

  var config = {
    // text input element to which we're attaching this autoComplete handler.
    attachTo: '.mention',
    // route to which we make our JSON request.
    route: '/mock',
    // characters required after @ for autocomplete to fire.
    minLength: 3,
    // attribute within each individual object in the backend response that gets us the username.
    resAtt: 'username',
    // attribute name on our query object (backend needs to know this to get to the search term).
    reqAtt: 'search'
  };

  //
  // ------------------- autoComplete handler starts from here --------------
  //

  $( config.attachTo )
    .bind( 'keydown', onKeyDown)
    .autocomplete({
      source: getData,
      search: autoCompleteWhen,
      focus: function() {
        return false;
      },
      select: insertValue
    });

  //
  // ----------------------- helper functions ---------------------------
  //

  // handle data response here (need .label and .value for each autocomplete object)
  function formatResponse(data) {
    return data.map(function(obj) {
      var ret_obj = {};
      ret_obj.label = '@' + obj[config.resAtt];
      ret_obj.value = obj[config.resAtt];
      return ret_obj;
    });
  }
  function split( val ) {
    return val.split( /\s*@/ );
  }
  function extractLast( term ) {
    return split( term ).pop();
  }
  function getData(request, response) {
    var term = extractLast( request.term );
    var query= {};
    query[config.reqAtt] = term;
    $.getJSON( config.route, query, function(data) {
      var formattedData = formatResponse(data);
      if (term.indexOf(' ') !== -1) {
        response();
        return;
      }
      response(formattedData);
    });
  }
  function insertValue( event, ui ) {
    var terms = this.value.split( /\s+@/ );
    // special case; don't add a space before @ if the mention is the first thing user enters.
    if (terms.length === 1) {this.value = '@' + ui.item.value + ' '; return false;}
    terms.pop();
    terms.push( ui.item.value );
    this.value = terms.join( ' @' ) + ' ';
    return false;
  }
  function autoCompleteWhen() {
    var term = extractLast( this.value );
    if (split(this.value).length === 1 || term.length < config.minLength) return false;
  }
  function onKeyDown(event) {
    if ( event.keyCode === $.ui.keyCode.TAB &&
        $( this ).autocomplete( 'instance' ).menu.active ) {
      event.preventDefault();
    }
  }
});

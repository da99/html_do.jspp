/* jshint strict: true, undef: true */
/* globals spec, _ */
/* globals exports */


spec(standard_name, ['NAME NAME'], "name name");     // it 'lowercases names'
spec(standard_name, ['  name  '],  'name');          // it 'trims string'
spec(standard_name, ['n   aME'],   'n ame');         // it 'squeezes whitespace'

exports.standard_name = standard_name;
function standard_name(str) {
  "use strict";

  var WHITESPACE = /\s+/g;
  return _.trim(str).replace(WHITESPACE, ' ').toLowerCase();
}

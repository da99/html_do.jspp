/* jshint strict: true, undef: true */
/* globals _, and */
/* globals exports */

exports.find = find;
function find(_funcs) {
  "use strict";

  var funcs = _.toArray(arguments);

  return function (v) {
    return _.find(v, and.apply(null, funcs));
  };
}

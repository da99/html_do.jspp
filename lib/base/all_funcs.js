/* jshint strict: true, undef: true */
/* globals _ */

exports.all_funcs = all_funcs;
function all_funcs(arr) {
  "use strict";
  var l = arr.length;
  return _.isFinite(l) && l > 0 && _.all(arr, _.isFunction);
}

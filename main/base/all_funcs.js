/* jshint strict: true, undef: true */
/* globals _ */

function all_funcs(arr) {
  "use strict";
  var l = arr.length;
  return _.isFinite(l) && l > 0 && _.all(arr, _.isFunction);
}

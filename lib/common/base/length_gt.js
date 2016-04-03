/* jshint strict: true, undef: true */
/* globals exports */


exports.length_gt = length_gt;
function length_gt(num) {
  "use strict";

  return function (v) { return v.length > num;};
}

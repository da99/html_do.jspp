/* jshint strict: true, undef: true */


exports.length_gt = length_gt;
function length_gt(num) {
  "use strict";

  return function (v) { return v.length > num;};
}

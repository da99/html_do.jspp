/* jshint strict: true, undef: true */


function length_gt(num) {
  "use strict";

  return function (v) { return v.length > num;};
}

/* jshint strict: true, undef: true */
/* globals length */

exports.is_length_zero = is_length_zero;
function is_length_zero(v) {
  "use strict";
  return length(v) === 0;
}

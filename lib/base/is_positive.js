/* jshint strict: true, undef: true */

exports.is_positive = is_positive;
function is_positive(v) {
  "use strict";

  return typeof v === 'number' && isFinite(v) && v > 0;
}

/* jshint strict: true, undef: true */

function is_positive(v) {
  "use strict";

  return typeof v === 'number' && isFinite(v) && v > 0;
}

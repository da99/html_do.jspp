/* jshint strict: true, undef: true */


exports.is_num = is_num;
function is_num(v) {
  "use strict";

  return typeof v === 'number' && isFinite(v);
}

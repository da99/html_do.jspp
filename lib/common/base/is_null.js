/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */


spec(is_null, [null], true);
spec(is_null, [undefined], false);
exports.is_null = is_null;
function is_null(v) {
  "use strict";

  return v === null;
}

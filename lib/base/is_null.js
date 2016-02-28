/* jshint strict: true, undef: true */
/* globals spec */


spec(is_null, [null], true);
spec(is_null, [undefined], false);
function is_null(v) {
  "use strict";

  return v === null;
}

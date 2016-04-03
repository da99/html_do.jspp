/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */


spec(is_undefined, [undefined], true);
spec(is_undefined, [null], false);

exports.is_undefined = is_undefined;
function is_undefined(v) {
  "use strict";

  return v === undefined;
}

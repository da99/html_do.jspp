/* jshint strict: true, undef: true */
/* globals spec */


spec(is_undefined, [undefined], true);
spec(is_undefined, [null], false);

function is_undefined(v) {
  "use strict";

  return v === undefined;
}

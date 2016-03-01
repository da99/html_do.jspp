/* jshint strict: true, undef: true */
/* globals exports */

exports.is_string = is_string;
function is_string(v) {
  "use strict";

  return typeof v === "string";
}

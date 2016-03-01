/* jshint strict: true, undef: true */

exports.is_string = is_string;
function is_string(v) {
  "use strict";

  return typeof v === "string";
}

/* jshint strict: true, undef: true */

exports.is_null_or_undefined = is_null_or_undefined;
function is_null_or_undefined(v) {
  "use strict";

  return v === null || v === undefined;
}

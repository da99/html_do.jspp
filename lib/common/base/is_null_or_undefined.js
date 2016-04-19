/* jshint strict: true, undef: true */
/* globals exports */

exports.is_null_or_undefined = is_null_or_undefined;
function is_null_or_undefined(v) {

  return v === null || v === undefined;
}

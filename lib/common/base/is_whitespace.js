/* jshint strict: true, undef: true */
/* globals is_string, length, _  */
/* globals exports */

exports.is_whitespace = is_whitespace;
function is_whitespace(v) {

  return is_string(v) && length(_.trim(v)) === 0;
}

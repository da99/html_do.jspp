/* jshint strict: true, undef: true */
/* globals is_string, length, _  */

exports.is_whitespace = is_whitespace;
function is_whitespace(v) {
  "use strict";

  return is_string(v) && length(_.trim(v)) === 0;
}

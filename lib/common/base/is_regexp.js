/* jshint strict: true, undef: true */
/* globals exports, _ */

exports.is_regexp = is_regexp;
function is_regexp(val) {
  return _.isRegExp(val);
}

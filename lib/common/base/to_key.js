/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.to_key = to_key;

function to_key(str) {
  return reduce(str, be(is_string), be(not(is_empty)), _.trim);
}

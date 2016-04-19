/* jshint strict: true, undef: true */
/* globals spec, is_array, is_string, is_plain_object, _, is_arguments */
/* globals exports */


spec(is_enumerable, [[]], true);
spec(is_enumerable, [{}], true);
spec(is_enumerable, [{}], true);

exports.is_enumerable = is_enumerable;
function is_enumerable(v) {

  return is_string(v) ||
  is_array(v)         ||
  is_plain_object(v)  ||
  _.isFinite(v.length) ||
    is_arguments(v);
}

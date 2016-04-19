/* jshint strict: true, undef: true */
/* globals is_plain_object, _ */
/* globals exports */


exports.keys_or_indexes = keys_or_indexes;
function keys_or_indexes(v) {
  
  if (is_plain_object(v))
    return _.keys(v);

  var a = [];
  for(var i = 0; i < v.length; i++) {
    a[i] = i;
  }
  return a;
}

/* jshint strict: true, undef: true */
/* globals is_plain_object, _ */


function keys_or_indexes(v) {
  "use strict";

  if (is_plain_object(v))
    return _.keys(v);

  var a = [];
  for(var i = 0; i < v.length; i++) {
    a[i] = i;
  }
  return a;
}

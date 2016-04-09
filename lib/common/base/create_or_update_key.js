/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.create_or_update_key = create_or_update_key;

function create_or_update_key(orig_o, name, val) {
  "use strict";
  var o = copy_value(orig_o);
  var k = reduce(
    name,
    be(is_string),
    _.trim,
    to_var_name
  );

  o[k] = be(is_something, val);
  return o;
}

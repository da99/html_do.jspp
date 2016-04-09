/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.update_key = update_key;

function update_key(o, k, v) {
  "use strict";

  if (!o.hasOwnProperty(k))
    throw new Error("Key not defined: " + to_string(k) + " in: " + to_string(o));

  var new_o = copy_value(o);
  new_o[k] = be(is_something, v);

  return new_o;
} // === function


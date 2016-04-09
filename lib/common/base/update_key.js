/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.update_key = update_key;

function update_key(o, k, v) {
  "use strict";

  if (!o.hasOwnProperty(k))
    throw new Error("Key not defined: " + to_string(k) + " in: " + to_string(o));

  return create_or_update_key.apply(null, arguments);
} // === function


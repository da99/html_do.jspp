/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.create_key = create_key;

function create_key(o, k, v) {
  "use strict";

  if (o.hasOwnProperty(k))
    throw new Error("Key already defined: " + to_string(k) + " value: " + to_string(v));

  return create_or_update_key.apply(null, arguments);
} // === function

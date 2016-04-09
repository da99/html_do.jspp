/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, is_string, not, is_empty, _ */

exports.read_key = read_key;

function read_key(o, k) {
  "use strict";

  if (!o.hasOwnProperty(k))
    throw new Error("Key not defined: " + to_string(k));

  return o[k];
} // === function

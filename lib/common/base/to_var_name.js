/* jshint strict: true, undef: true */
/* globals exports */
/* globals be, reduce, to_key, is_string, not, is_empty, _ */

exports.to_var_name = to_var_name;

// Removes begining slash, if any.
function to_var_name(val, delim) {
  "use strict";

  if (length(arguments) == 1)
    delim = "_";

  return val
  .replace(/^[\/]+/, "")
  .replace(/[^a-zA-Z-0-9\_\-]+/g, delim);
}


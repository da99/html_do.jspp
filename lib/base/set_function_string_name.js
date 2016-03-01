/* jshint strict: true, undef: true */
/* globals to_string, function_sig */
/* globals exports */


exports.set_function_string_name = set_function_string_name;
function set_function_string_name(f, args) {
  "use strict";

  if (f.to_string_name)
    throw new Error('.to_string_name alread set: ' + to_string(f.to_string_name));
  f.to_string_name = function_sig(f, args);
  return f;
}

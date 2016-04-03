/* jshint strict: true, undef: true */
/* globals spec, is_string, window, is_function */
/* globals exports */


spec(is_function_name, ['is_function'], true);
spec(is_function_name, ['none none'], false);
spec(is_function_name, [is_function_name], false);

exports.is_function_name = is_function_name;
function is_function_name(v) {
  "use strict";

  if (!is_string(v))
    return false;

  return is_function(window[v]);
}

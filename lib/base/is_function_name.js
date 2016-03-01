/* jshint strict: true, undef: true */
/* globals spec, is_string */
/* globals exports */


spec(is_function_name, ['is_function'], true);
spec(is_function_name, ['none none'], false);
spec(is_function_name, [is_function_name], false);

exports.is_function_name = is_function_name;
function is_function_name(v) {
  "use strict";

  return is_string(v) && typeof v === 'function';
}

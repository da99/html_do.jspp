/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */


spec(function_to_name, ["function my_name() {}"], "my_name");

exports.function_to_name = function_to_name;
function function_to_name(f) {
  "use strict";

  var WHITESPACE = /\s+/g;
  return f.to_string_name || f.toString().split('(')[0].split(WHITESPACE)[1] || f.toString();
}

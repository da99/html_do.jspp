/* jshint strict: true, undef: true */
/* globals length */
/* globals exports */



exports.replace = replace;
function replace(pattern, new_value) {
  "use strict";

  if (length(arguments) === 3) {
    return arguments[2].replace(arguments[0], arguments[1]);
  }

  return function (v) {
    return v.replace(pattern, new_value);
  };
}

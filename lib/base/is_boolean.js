/* jshint strict: true, undef: true */

exports.is_boolean = is_boolean;
function is_boolean(v) {
  "use strict";

  return typeof v === 'boolean';
}

/* jshint strict: true, undef: true */
/* globals exports */

exports.is_boolean = is_boolean;
function is_boolean(v) {
  "use strict";

  return typeof v === 'boolean';
}
